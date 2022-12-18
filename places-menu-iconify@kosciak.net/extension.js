
const { Clutter, St } = imports.gi;

const Main = imports.ui.main;
// const ExtensionUtils = imports.misc.extensionUtils;

// translation needed to restore Places label, if any
// NOTE: ExtensionUtils.gettext doesn't work correctly
// const _ = ExtensionUtils.gettext;
// const N_ = x => x;
const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;
const N_ = x => x;

const PLACES_INDICATOR_ID = 'places-menu';
const PLACES_ICON_NAME = 'folder-symbolic';


class Extension {

    constructor() {
        this.placesIndicator = null;
        this.extensionsChanged = null;
    }

    _iconify(showIcon) {
        this.placesIndicator = Main.panel.statusArea[PLACES_INDICATOR_ID];
        if (this.placesIndicator) {
            this.placesIndicator.remove_child(
                this.placesIndicator.get_first_child()
            );
            let child;
            if (showIcon) {
                child = new St.Icon({
                    icon_name: PLACES_ICON_NAME,
                    style_class: 'system-status-icon',
                });
            } else {
                child = new St.Label({
                    text: _('Places'),
                    y_expand: true,
                    y_align: Clutter.ActorAlign.CENTER,
                });
            }
            this.placesIndicator.add_child(child);
        }

    }

    enable() {
        this._iconify(true);
        this.extensionsChanged = Main.extensionManager.connect(
            'extension-state-changed', () => this._iconify(true)
        );
    }

    disable() {
        if (this.placesIndicator) {
            this._iconify(false);
            Main.extensionManager.disconnect(this.extensionsChanged);
        }
        this.placesIndicator = null;
        this.extensionsChanged = null;
    }

}


function init() {
    // ExtensionUtils.initTranslations();
	return new Extension();
}
