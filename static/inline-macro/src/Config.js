/**
 * Inline Macro — Configuration Panel (UI Kit)
 *
 * This component is rendered when a page author clicks the pencil icon on the
 * macro. It collects playback options that are stored in the macro's config
 * and read back in App.js via ctx.extension.config.
 *
 * Only UI Kit components from @forge/react may be used here.
 * Standard HTML elements (<div>, <input>, etc.) will NOT render in the
 * Forge config panel context.
 *
 * Available playback options:
 *   - autoplay  : boolean — start playing immediately on page load
 *   - loop      : boolean — loop the recording
 *   - speed     : number  — playback speed multiplier (default 1)
 *   - theme     : string  — colour theme for the terminal
 *   - cols      : number  — override terminal width (optional)
 *   - rows      : number  — override terminal height (optional)
 */

import React from 'react';
import ForgeReconciler, {
  Checkbox,
  Label,
  Select,
  Textfield,
  Stack,
  Text,
  useConfig,
} from '@forge/react';

// Theme choices supported by the asciinema-player library
const THEME_OPTIONS = [
  { label: 'asciinema (default)', value: 'asciinema' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Dracula', value: 'dracula' },
];

function Config() {
  // useConfig() returns the currently saved config values so we can
  // pre-populate the form fields on re-open.
  const config = useConfig() ?? {};

  return (
    <Stack space="space.200">
      <Text>
        Paste your <strong>.cast</strong> file content into the macro body,
        then configure playback options below.
      </Text>

      {/* ── Playback behaviour ── */}
      <Label>Autoplay</Label>
      <Checkbox
        name="autoplay"
        label="Start playing automatically when the page loads"
        defaultChecked={config.autoplay === true || config.autoplay === 'true'}
      />

      <Label>Loop</Label>
      <Checkbox
        name="loop"
        label="Loop the recording continuously"
        defaultChecked={config.loop === true || config.loop === 'true'}
      />

      <Label>Speed</Label>
      <Textfield
        name="speed"
        placeholder="1"
        defaultValue={config.speed ?? '1'}
        description="Playback speed multiplier. 1 = normal, 2 = double speed."
      />

      {/* ── Visual options ── */}
      <Label>Theme</Label>
      <Select
        name="theme"
        options={THEME_OPTIONS}
        defaultValue={
          THEME_OPTIONS.find((t) => t.value === (config.theme ?? 'asciinema')) ?? THEME_OPTIONS[0]
        }
      />

      {/* ── Terminal size overrides ── */}
      <Label>Terminal Width (columns)</Label>
      <Textfield
        name="cols"
        placeholder="Auto (from cast header)"
        defaultValue={config.cols ?? ''}
        description="Leave blank to use the width declared in the .cast file."
      />

      <Label>Terminal Height (rows)</Label>
      <Textfield
        name="rows"
        placeholder="Auto (from cast header)"
        defaultValue={config.rows ?? ''}
        description="Leave blank to use the height declared in the .cast file."
      />
    </Stack>
  );
}

// Register the config component with Forge so it appears in the config panel
ForgeReconciler.addConfig(<Config />);

export default Config;
