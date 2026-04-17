/**
 * Attachment Macro — Configuration Panel (UI Kit)
 *
 * Rendered when the author clicks the pencil icon on the macro.
 * Collects the attachment filename and playback options.
 *
 * Only @forge/react UI Kit components are permitted here.
 *
 * Config fields:
 *   - filename  : string  — name of the .cast file attached to this page (required)
 *   - autoplay  : boolean — start playing immediately
 *   - loop      : boolean — loop the recording
 *   - speed     : number  — playback speed multiplier
 *   - theme     : string  — terminal colour theme
 *   - poster    : number  — time (seconds) to use as poster/preview frame
 */

import React from 'react';
import ForgeReconciler, {
  Checkbox,
  Label,
  Select,
  Textfield,
  Stack,
  Text,
  SectionMessage,
  useConfig,
} from '@forge/react';

const THEME_OPTIONS = [
  { label: 'asciinema (default)', value: 'asciinema' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Dracula', value: 'dracula' },
];

function Config() {
  const config = useConfig() ?? {};

  return (
    <Stack space="space.200">
      <SectionMessage title="Attachment setup" appearance="info">
        <Text>
          Attach your <strong>.cast</strong> file to this Confluence page first,
          then enter its exact filename below.
        </Text>
      </SectionMessage>

      {/* ── Required: attachment filename ── */}
      <Label>Attachment filename (required)</Label>
      <Textfield
        name="filename"
        placeholder="demo.cast"
        defaultValue={config.filename ?? ''}
        description="The exact name of the .cast file attached to this page, including the extension."
      />

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

      {/* ── Poster frame ── */}
      <Label>Poster frame (seconds)</Label>
      <Textfield
        name="poster"
        placeholder="Leave blank for default"
        defaultValue={config.poster ?? ''}
        description="Time position (in seconds) to use as the preview image before playback starts."
      />
    </Stack>
  );
}

ForgeReconciler.addConfig(<Config />);

export default Config;
