import { useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { RotateIcon } from "components/icons/RotateIcon";
import { Button, ButtonVariant } from "components/ui/Button";

import { useConfirmationModalService } from "hooks/services/ConfirmationModal";

import styles from "./ConnectionSyncButtons.module.scss";
import { useConnectionSyncContext } from "./ConnectionSyncContext";

interface ConnectionSyncButtonsProps {
  buttonText: React.ReactNode;
  variant?: ButtonVariant;
  buttonClassName?: string;
}

export const ConnectionSyncButtons: React.FC<ConnectionSyncButtonsProps> = ({
  buttonText,
  variant,
  buttonClassName,
}) => {
  const {
    syncStarting,
    cancelStarting,
    cancelJob,
    syncConnection,
    connectionDeprecated,
    resetStreams,
    resetStarting,
    jobSyncRunning,
    jobResetRunning,
  } = useConnectionSyncContext();

  const { openConfirmationModal, closeConfirmationModal } = useConfirmationModalService();

  const resetWithModal = useCallback(() => {
    openConfirmationModal({
      text: `form.resetDataText`,
      title: `form.resetData`,
      submitButtonText: "form.reset",
      cancelButtonText: "form.noNeed",
      onSubmit: async () => {
        closeConfirmationModal();
        await resetStreams();
      },
      submitButtonDataId: "reset",
    });
  }, [closeConfirmationModal, openConfirmationModal, resetStreams]);

  return (
    <div className={styles.buttons}>
      {!jobSyncRunning && !jobResetRunning && (
        <>
          <Button
            onClick={resetWithModal}
            variant="secondary"
            className={buttonClassName}
            isLoading={resetStarting}
            disabled={syncStarting || resetStarting || connectionDeprecated}
          >
            <FormattedMessage id="connection.resetData" />
          </Button>
          <Button
            onClick={syncConnection}
            icon={
              syncStarting ? undefined : <RotateIcon height={styles.syncIconHeight} width={styles.syncIconHeight} />
            }
            variant={variant}
            className={buttonClassName}
            isLoading={syncStarting}
            data-testid="manual-sync-button"
            disabled={syncStarting || resetStarting || connectionDeprecated}
          >
            {buttonText}
          </Button>
        </>
      )}
      {(jobSyncRunning || jobResetRunning) && (
        <Button
          onClick={cancelJob}
          disabled={syncStarting || resetStarting || connectionDeprecated}
          isLoading={cancelStarting}
          variant="danger"
          className={buttonClassName}
        >
          <FormattedMessage
            id={resetStarting || jobResetRunning ? "connection.cancelReset" : "connection.cancelSync"}
          />
        </Button>
      )}
    </div>
  );
};