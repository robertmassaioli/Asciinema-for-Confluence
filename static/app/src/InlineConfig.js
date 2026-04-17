/**
 * Inline Macro — UI Kit Configuration Component
 *
 * Registered via ContextRoute's config prop → ForgeReconciler.addConfig().
 * Uses useConfig() to read back saved values for defaultValue population.
 *
 * Allowed components and props (macro config subset):
 *   Label (children only), CheckboxGroup (options, defaultValue, name),
 *   Select (options, defaultValue, placeholder, isRequired, name),
 *   Textfield (defaultValue, isRequired, name, placeholder)
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

const InlineConfig = () => {
  const config = useConfig() ?? {};

  return (
    <>
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

      <Label>Terminal Width (columns)</Label>
      <Textfield
        name="cols"
        placeholder="Auto (from cast header)"
        defaultValue={String(config.cols ?? '')}
      />

      <Label>Terminal Height (rows)</Label>
      <Textfield
        name="rows"
        placeholder="Auto (from cast header)"
        defaultValue={String(config.rows ?? '')}
      />
    </>
  );
};

export default InlineConfig;
