/**
 * Attachment Macro — UI Kit Configuration Component
 *
 * Registered via ContextRoute's config prop → ForgeReconciler.addConfig().
 * Uses useConfig() to read back saved values for defaultValue population.
 */

import React from 'react';
import { CheckboxGroup, Label, Select, Textfield, useConfig } from '@forge/react';

const THEME_OPTIONS = [
  { label: 'asciinema (default)', value: 'asciinema' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Dracula', value: 'dracula' },
];

const AttachmentConfig = () => {
  const config = useConfig() ?? {};

  return (
    <>
      <Label>Attachment filename (required)</Label>
      <Textfield
        name="filename"
        placeholder="demo.cast"
        isRequired={true}
        defaultValue={String(config.filename ?? '')}
      />

      <Label>Playback</Label>
      <CheckboxGroup
        name="playback"
        options={[
          { label: 'Autoplay — start playing automatically when the page loads', value: 'autoplay' },
          { label: 'Loop — loop the recording continuously', value: 'loop' },
        ]}
        defaultValue={[
          ...(config.autoplay === true || config.autoplay === 'true' ? ['autoplay'] : []),
          ...(config.loop === true || config.loop === 'true' ? ['loop'] : []),
        ]}
      />

      <Label>Speed</Label>
      <Textfield
        name="speed"
        placeholder="1"
        defaultValue={String(config.speed ?? '1')}
      />

      <Label>Theme</Label>
      <Select
        name="theme"
        options={THEME_OPTIONS}
        defaultValue={config.theme ?? 'asciinema'}
      />

      <Label>Poster frame (seconds)</Label>
      <Textfield
        name="poster"
        placeholder="Leave blank for default"
        defaultValue={String(config.poster ?? '')}
      />
    </>
  );
};

export default AttachmentConfig;
