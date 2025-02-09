/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import {getLogger} from 'Util/Logger';
import {formatSeconds} from 'Util/TimeUtil';

import {AbstractAssetTransferStateTracker} from './AbstractAssetTransferStateTracker';
import {AssetTransferState} from '../../assets/AssetTransferState';

class VideoAssetComponent extends AbstractAssetTransferStateTracker {
  /**
   * Construct a new video asset.
   *
   * @param {Object} params - Component parameters
   * @param {Message} params.message - Message entity
   * @param {Object} componentInfo - Component information
   */
  constructor(params, {element}) {
    super(ko.unwrap(params.message));
    this.logger = getLogger('VideoAssetComponent');

    this.message = ko.unwrap(params.message);
    this.asset = this.message.get_first_asset();

    this.video_element = $(element).find('video')[0];
    this.video_src = ko.observable();
    this.video_time = ko.observable();

    this.video_playback_error = ko.observable(false);
    this.show_bottom_controls = ko.observable(false);

    this.video_time_rest = ko.pureComputed(() => this.video_element.duration - this.video_time());

    this.preview = ko.observable();

    ko.computed(
      () => {
        if (this.asset.preview_resource()) {
          this.asset.load_preview().then(blob => this.preview(window.URL.createObjectURL(blob)));
        }
      },
      {disposeWhenNodeIsRemoved: element},
    );

    this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
    this.on_pause_button_clicked = this.on_pause_button_clicked.bind(this);
    this.displaySmall = ko.observable(!!params.isQuote);

    this.formatSeconds = formatSeconds;
    this.AssetTransferState = AssetTransferState;
  }

  on_loadedmetadata() {
    this.video_time(this.video_element.duration);
  }

  on_timeupdate() {
    this.video_time(this.video_element.currentTime);
  }

  on_error(component, jquery_event) {
    this.video_playback_error(true);
    this.logger.error('Video cannot be played', jquery_event);
  }

  onPlayButtonClicked() {
    this.displaySmall(false);
    if (this.video_src()) {
      if (this.video_element) {
        this.video_element.play();
      }
    } else {
      this.asset
        .load()
        .then(blob => {
          this.video_src(window.URL.createObjectURL(blob));
          if (this.video_element) {
            this.video_element.play();
          }
          this.show_bottom_controls(true);
        })
        .catch(error => this.logger.error('Failed to load video asset ', error));
    }
  }

  on_pause_button_clicked() {
    if (this.video_element) {
      this.video_element.pause();
    }
  }

  on_video_playing() {
    this.video_element.style.backgroundColor = '#000';
  }

  dispose() {
    window.URL.revokeObjectURL(this.video_src());
    window.URL.revokeObjectURL(this.preview());
  }
}

ko.components.register('video-asset', {
  template: `
    <!-- ko ifnot: message.isObfuscated() -->
      <div class="video-asset-container"
        data-bind="hide_controls: 2000,
                   attr: {'data-uie-value': asset.file_name},
                   css: {'video-asset-container--small': displaySmall()}"
        data-uie-name="video-asset">
        <video playsinline
               data-bind="attr: {src: video_src, poster: preview},
                          css: {hidden: transferState() === AssetTransferState.UPLOADING},
                          style: {backgroundColor: preview() ? '#000': ''},
                          event: {loadedmetadata: on_loadedmetadata,
                                  timeupdate: on_timeupdate,
                                  error: on_error,
                                  playing: on_video_playing}">
        </video>
        <!-- ko if: video_playback_error -->
          <div class="video-playback-error label-xs" data-bind="text: t('conversationPlaybackError')"></div>
        <!-- /ko -->
        <!-- ko ifnot: video_playback_error -->
          <!-- ko if: transferState() === AssetTransferState.UPLOAD_PENDING -->
            <div class="asset-placeholder loading-dots">
            </div>
          <!-- /ko -->

          <!-- ko if: transferState() !== AssetTransferState.UPLOAD_PENDING -->
            <div class="video-controls-center">
              <!-- ko if: displaySmall() -->
                <media-button params="src: video_element,
                                      large: false,
                                      asset: asset,
                                      play: onPlayButtonClicked,
                                      transferState: transferState,
                                      uploadProgress: uploadProgress
                                      ">
                </media-button>
              <!-- /ko -->
              <!-- ko ifnot: displaySmall() -->
                <media-button params="src: video_element,
                                      large: true,
                                      asset: asset,
                                      play: onPlayButtonClicked,
                                      pause: on_pause_button_clicked,
                                      cancel: () => cancelUpload(message),
                                      transferState: transferState,
                                      uploadProgress: uploadProgress
                                      ">
                </media-button>
              <!-- /ko -->
            </div>
            <div class='video-controls-bottom' data-bind='visible: show_bottom_controls()'>
              <seek-bar data-ui-name="status-video-seekbar" class="video-controls-seekbar" params="src: video_element"></seek-bar>
              <span class="video-controls-time label-xs" data-bind="text: formatSeconds(video_time_rest())" data-uie-name="status-video-time"></span>
            </div>
          <!-- /ko -->
        <!-- /ko -->
      </div>
      <div class="video-asset-container__sizer"></div>
    <!-- /ko -->
  `,
  viewModel: {
    createViewModel(params, componentInfo) {
      return new VideoAssetComponent(params, componentInfo);
    },
  },
});
