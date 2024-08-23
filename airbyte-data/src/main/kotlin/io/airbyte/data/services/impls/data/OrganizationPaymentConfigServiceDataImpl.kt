package io.airbyte.data.services.impls.data

import io.airbyte.config.OrganizationPaymentConfig
import io.airbyte.data.repositories.OrganizationPaymentConfigRepository
import io.airbyte.data.services.OrganizationPaymentConfigService
import io.airbyte.data.services.impls.data.mappers.toConfigModel
import jakarta.inject.Singleton
import java.util.UUID

@Singleton
class OrganizationPaymentConfigServiceDataImpl(
  private val organizationPaymentConfigRepository: OrganizationPaymentConfigRepository,
) : OrganizationPaymentConfigService {
  override fun findByOrganizationId(organizationId: UUID): OrganizationPaymentConfig? =
    organizationPaymentConfigRepository.findById(organizationId).orElse(null)?.toConfigModel()
}