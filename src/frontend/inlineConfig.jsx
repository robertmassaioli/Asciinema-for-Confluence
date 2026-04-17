/**
 * Inline Macro — UI Kit Configuration Panel
 *
 * Registered via ForgeReconciler.addConfig(). Forge bundles this file
 * directly — no separate package.json or build step required.
 *
 * Only config-approved components and props are used:
 *   - Label (children only — no labelFor/id in macro config context)
 *   - CheckboxGroup (options array, defaultValue, name)
 *   - Select (options array, defaultValue, name)
 *   - Textfield (defaultValue, name, placeholder)
 */

import ForgeReconciler, {
  CheckboxGroup,
  Label,
  Select,
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

ForgeReconciler.render(<React.StrictMode><></></React.StrictMode>);
ForgeReconciler.addConfig(<Config />);
