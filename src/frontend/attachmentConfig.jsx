/**
 * Attachment Macro — UI Kit Configuration Panel
 *
 * Registered via ForgeReconciler.addConfig(). Forge bundles this file
 * directly — no separate package.json or build step required.
 *
 * Only config-approved components are used:
 * CheckboxGroup, Label, Select, Textfield
 */

import ForgeReconciler, {
  CheckboxGroup,
  Label,
  Select,
  Option,
  Textfield,
  useConfig,
} from '@forge/react';
import React from 'react';

const THEME_OPTIONS = [
  { label: 'asciinema (default)', value: 'asciinema' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Dracula', value: 'dracula' },
];

const Config = () => {
  const config = useConfig() ?? {};

  return (
    <>
      <Label labelFor="filename">Attachment filename (required)</Label>
      <Textfield
        id="filename"
        name="filename"
        placeholder="demo.cast"
        defaultValue={String(config.filename ?? '')}
        description="The exact filename of the .cast attachment on this page, including the .cast extension."
      />

      <Label labelFor="playback">Playback</Label>
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

      <Label labelFor="speed">Speed</Label>
      <Textfield
        id="speed"
        name="speed"
        placeholder="1"
        defaultValue={String(config.speed ?? '1')}
        description="Playback speed multiplier. 1 = normal, 2 = double speed."
      />

      <Label labelFor="theme">Theme</Label>
      <Select
        id="theme"
        name="theme"
        defaultValue={config.theme ?? 'asciinema'}
      >
        {THEME_OPTIONS.map((t) => (
          <Option key={t.value} label={t.label} value={t.value} />
        ))}
      </Select>

      <Label labelFor="poster">Poster frame (seconds)</Label>
      <Textfield
        id="poster"
        name="poster"
        placeholder="Leave blank for default"
        defaultValue={String(config.poster ?? '')}
        description="Time position (in seconds) to use as the preview image before playback starts."
      />
    </>
  );
};

ForgeReconciler.addConfig(<Config />);
