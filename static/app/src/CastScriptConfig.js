/**
 * CastScript Macro — UI Kit Configuration Component
 *
 * Registered via ContextRoute's config prop → ForgeReconciler.addConfig().
 * Uses useConfig() to read back saved values for defaultValue population.
 *
 * NOTE: This component runs in the ForgeReconciler (UI Kit) world.
 * Do NOT import or use it from ReactDOM-rendered components.
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

const CastScriptConfig = () => {
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
        defaultValue={Array.isArray(config.playback) ? config.playback : []}
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

      <Label>Typing Seed (optional)</Label>
      <Textfield
        name="seed"
        placeholder="Leave blank for random timing"
        defaultValue={String(config.seed ?? '')}
      />
    </>
  );
};

export default CastScriptConfig;
