import '../atoms/cc-input-text.js';
import '../molecules/cc-block-section.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import backupSvg from './backup.svg';
import { ccLink, linkStyles } from '../templates/cc-link.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * A components to display backups available for an add-on
 *
 * ## Details
 *
 * * When `backups` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * ## Type definitions
 *
 * ```js
 * interface BackupDetails {
 *   providerId: string,
 *   restoreCommand: string,
 *   esAddonBackupRepositoryUrl?: string,
 *   list: Backup[],
 * }
 * ```
 *
 * ```js
 * interface Backup {
 *   createdAt: Date,
 *   expiresAt: Date
 *   url: string,
 * }
 * ```
 *
 * @prop {BackupDetails} backups - Sets the different details about an add-on and its backup.
 * @prop {Boolean} deploying - Displays a message about the addon not being ready yet.
 * @prop {Boolean} error - Displays an error message.
 */
export class CcAddonBackups extends LitElement {

  static get properties () {
    return {
      backups: { type: Object, attribute: false },
      deploying: { type: Boolean },
      error: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  static get skeletonBackups () {
    const backup = { createdAt: new Date(), expiresAt: new Date() };
    return {
      addon: '',
      list: new Array(5).fill(backup),
      restoreCommand: '',
    };
  }

  _getDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.description.es-addon');
      case 'es-addon-old':
        return i18n('cc-addon-backups.description.es-addon-old');
      default:
        return fakeString(150);
    }
  }

  _getBackupText (createdAt, expiresAt) {
    return (expiresAt != null)
      ? i18n('cc-addon-backups.text', { createdAt, expiresAt })
      : i18n('cc-addon-backups.text.user-defined-retention', { createdAt });
  }

  _getBackupLink (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.link.es-addon');
      case 'es-addon-old':
        return i18n('cc-addon-backups.link.es-addon-old');
      default:
        return fakeString(18);
    }
  }

  _displaySectionWithService (providerId) {
    switch (providerId) {
      case 'es-addon':
        return true;
      case 'es-addon-old':
        return false;
      default:
        return false;
    }
  }

  _getRestoreWithServiceTitle (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.restore.with-service.title.es-addon');
      default:
        return fakeString(20);
    }
  }

  _getRestoreWithServiceDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.restore.with-service.description.es-addon', {
          href: (this.backups != null) ? this.backups.esAddonBackupRepositoryUrl : '',
        });
      default:
        return fakeString(80);
    }
  }

  _getManualRestoreDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
      case 'es-addon-old':
        return i18n('cc-addon-backups.restore.manual.description.es-addon');
      default:
        return fakeString(70);
    }
  }

  _getDeleteWithServiceTitle (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.delete.with-service.title.es-addon');
      default:
        return fakeString(20);
    }
  }

  _getDeleteWithServiceDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.delete.with-service.description.es-addon', {
          href: (this.backups != null) ? this.backups.esAddonBackupRepositoryUrl : '',
        });
      default:
        return fakeString(80);
    }
  }

  _getManualDeleteDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
      case 'es-addon-old':
        return i18n('cc-addon-backups.delete.manual.description.es-addon');
      default:
        return fakeString(70);
    }
  }

  render () {

    const skeleton = (this.backups == null);
    const { providerId, list: backups, restoreCommand } = skeleton ? CcAddonBackups.skeletonBackups : this.backups;
    const hasData = (!this.error && !this.deploying && (backups.length > 0));
    const emptyData = (!this.error && !this.deploying && (backups.length === 0));

    return html`

      <cc-block>
        <div slot="title">${i18n('cc-addon-backups.title')}</div>
        
        ${hasData ? html`
          <div><span class=${classMap({ skeleton })}>${this._getDescription(providerId)}</span></div>
          
          ${backups.map(({ createdAt, url, expiresAt }) => html`
            <div class="backup">
              <span class="backup-icon"><img src=${backupSvg} alt=""></span>
              <span class="backup-text">
                <span class="backup-text-details ${classMap({ skeleton })}">${this._getBackupText(createdAt, expiresAt)}</span>
                ${ccLink(url, this._getBackupLink(providerId), skeleton)}
              </span>
            </div>
          `)}
        ` : ''}
        
        ${emptyData ? html`
          <div class="cc-block_empty-msg">${i18n('cc-addon-backups.empty')}</div>
        ` : ''}
        
        ${this.deploying ? html`
          <cc-error>${i18n('cc-addon-backups.deploying')}</cc-error>
        ` : ''}
        
        ${this.error ? html`
          <cc-error>${i18n('cc-addon-backups.loading-error')}</cc-error>
        ` : ''}
      </cc-block>
      
      ${!this.error && !this.deploying ? html`
        <cc-block state="close">
          <div slot="title">${i18n('cc-addon-backups.restore')}</div>
          
          ${this._displaySectionWithService(providerId) ? html`
            <cc-block-section>
              <div slot="title">${this._getRestoreWithServiceTitle(providerId)}</div>
              <div><span class=${classMap({ skeleton })}>${this._getRestoreWithServiceDescription(providerId)}</span></div>
            </cc-block-section>
          ` : ''}
          
          <cc-block-section>
            <div slot="title">${i18n('cc-addon-backups.restore.manual.title')}</div>
            <div><span class=${classMap({ skeleton })}>${this._getManualRestoreDescription(providerId)}</span></div>
            <cc-input-text readonly clipboard multi ?skeleton=${skeleton} value="${ifDefined(restoreCommand)}"></cc-input-text>
          </cc-block-section>
        </cc-block>
      ` : ''}
      
      ${!this.error && !this.deploying ? html`
        <cc-block state="close">
          <div slot="title">${i18n('cc-addon-backups.delete')}</div>
          
          ${this._displaySectionWithService(providerId) ? html`
            <cc-block-section>
              <div slot="title">${this._getDeleteWithServiceTitle(providerId)}</div>
              <div>${this._getDeleteWithServiceDescription(providerId)}</div>
            </cc-block-section>
          ` : ''}
        
          <cc-block-section>
            <div slot="title">${i18n('cc-addon-backups.delete.manual.title')}</div>
            <div><span class=${classMap({ skeleton })}>${this._getManualDeleteDescription(providerId)}</span></div>
            <cc-input-text readonly clipboard multi ?skeleton=${skeleton} value="${ifDefined(restoreCommand)}"></cc-input-text>
          </cc-block-section>
        </cc-block>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      skeleton,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: grid;
          grid-gap: 1rem;
          line-height: 1.5;
        }

        .backup {
          display: flex;
          line-height: 1.5rem;
        }

        .backup-icon,
        .backup-text {
          margin-right: 0.5rem;
        }

        .backup-icon {
          flex: 0 0 auto;
          height: 1.5rem;
          width: 1.5rem;
        }

        .backup-icon img {
          display: block;
          height: 100%;
          width: 100%;
        }

        .backup-text {
          color: #555;
        }

        .backup-text-details:not(.skeleton) strong {
          color: #000;
        }

        [title] {
          cursor: help;
        }

        cc-input-text {
          margin: 0;
        }

        /* SKELETON */
        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-backups', CcAddonBackups);
