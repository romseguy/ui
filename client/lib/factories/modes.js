import modeTypes from 'lib/maps/modeTypes'

export function createModes(t) {
  return [{
    key: modeTypes.DISCOVERY,
    labels: {
      active: t('canvas:modes.discovery.labels.active'),
      disabled: t('canvas:modes.discovery.labels.disabled'),
      inactive: t('canvas:modes.discovery.labels.inactive')
    },
    disabled: false,
    iconId: 'search'
  }, {
    key: modeTypes.EDIT,
    labels: {
      active: t('canvas:modes.edit.labels.active'),
      disabled: t('canvas:modes.edit.labels.disabled'),
      inactive: t('canvas:modes.edit.labels.inactive')
    },
    disabled: false,
    iconId: 'edit'
  }, {
    key: modeTypes.NOTIFICATION,
    labels: {
      active: t('canvas:modes.notification.labels.active'),
      disabled: t('canvas:modes.notification.labels.disabled'),
      inactive: t('canvas:modes.notification.labels.inactive')
    },
    disabled: false,
    iconId: 'volume'
  }]
}
