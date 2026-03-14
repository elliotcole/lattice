# Tuning Lattice

## What it is

Tuning Lattice is a visual and playable environment for working with just intonation. It lets you build tuning systems as ratio networks, hear them immediately, save playable scenes, and turn them into finished diagrams or exported tuning data.

The lattice diagram itself has a long history. Variants appear in Euler's *tonnetz* and in later Just Intonation work by composers and theorists including Harry Partch, Ben Johnston, James Tenney, La Monte Young, Terry Riley, Michael Harrison, and Erv Wilson. Tuning Lattice extends that paper-and-pencil tradition into an interactive tool: you can design lattices in 2D or 3D, assign prime factors to axes, work beyond three dimensions with custom nodes, and move fluidly between analysis, performance, and layout.

At its core, the app treats every node as a frequency ratio relative to a fundamental. From there, you can use the same structure in several different ways: as a tuning designer, a calculator, an instrument, a composition aid, a practice tool, and a diagram/layout tool.

## A simple first session

If you are new to the Lattice, this is a good first session:

1. Set the fundamental.
2. Choose simple axis factors such as 3, 5 and 7.
3. SHIFT-click to add a few nearby nodes around the center. (Z-click to enter Z axis.)
4. Click the nodes and hear the intervals.
5. OPTION-1 to save it as a snapshot.
6. Change the lattice and the playing nodes.
7. OPTION-2 to save that as a snapshot.
8. Press 1 and 2 to toggle between snapshots.
9. Open the Tuner from the top menu.
9. Switch to Layout mode and make a clean diagram.

That sequence covers the main ideas: one lattice can function as a theory model, a playable instrument, a rehearsal aid, and a finished document.

## Ways to use it

### As a tuning designer

1. Set the fundamental at the top of the app.
2. Choose the prime-based factors for the X, Y, and Z axes.
3. Start from the center node and SHIFT-click to add nearby ratios extending along the lattice. (OPTION/ALT-click to remove ratios.)
4. Click nodes to toggle sound on and off.
4. Use the displayed ratio, Hz, and cents readouts to evaluate the structure.
5. Hold Z and click on a node to add notes along its Z axis.
6. Save your work with File > Save Lattice, or just copy the URL, which encodes all state data.

#### To go beyond 3 dimensions

Use Custom Nodes: hold C and click on a node to add a custom node based on any ratio. Custom nodes are represented as diamonds to show they are off the x-y-z grid.

#### If you already have a list of ratios relative to 1:1

Use Calculate > Find Ratios to build a lattice with them.

#### If you already have a list of intervals

Use Calculate > Build from Intervals.

### As a just intonation calculator

Working in Just Intonation means making lots of calculations; Tuning Lattice can be a calculator for ratios, frequencies, cents, and interval relationships.

#### Useful tools

- Hz, ratio, and cents readouts on nodes.
- Interval finding and ratio search, via the Calculate menu.
- Interval overlay to explore relationships.
- Distance lines for labeling and comparing relationships between nodes.

#### To inspect frequencies and cents

1. Set the fundamental and A4 reference if needed.
2. Turn on the readouts you want in the Options panel, such as Hz, cents, or cents deviation.
3. Build the nodes you want to compare.
4. Read each node directly in the lattice for values.

### To inspect interval names between each pair of nodes

1. Turn on Interval Overlay in the View panel.
2. Hover over nodes to see interval name labels.

#### To calculate the interval between two nodes

1. Turn on Distances in the View panel and click Edit.
2. Click and drag between nodes to create Distance measurement lines.
3. Double click labels to customize their text.
4. OPTION/ALT-click distance line to remove it.

#### To find a new node on the lattice as an interval from an existing node

1. Hold I and click on a node, or select Calculate > Find Interval.
2. Choose an interval from the list, or enter a new ratio.

#### To visualize overtone interactions

1. Click Overtones to enter the Overtone Tool.
2. Edit the ratios in the Input Notes box as desired. Adding line breaks separates ratios into chords.
3. Show/hide overtones, combination tones, and columns showing alignments and roughness.
4. Click nodes to hear them.
5. Switch to Print mode to create print-ready diagrams.

### As an instrument

Tuning Lattice is not just a visual editor. It is also a playable instrument with a built-in synth, keyboard mappings, MIDI input, pattern playback, one-button looper, LFOs, and retuned MIDI out.

#### Main ways to play it

- Click to toggle nodes directly in the lattice.
- Use QWERTY keyboard mappings.
- Play from a MIDI controller.
- Build repeating playback patterns.
- Loop your own performance.
- Send retuned MIDI out to an external synth or MPE-capable instrument.
- Save and recall snapshots to sequence chords and play states.

#### Simple playback

1. Click nodes to turn them on or off.
2. V-click a node to adjust individual volume levels.
3. Adjust the synth waveform and envelope in the Synth menu.
4. SHIFT-spacebar turns all notes off.

#### To play from the computer keyboard

1. Choose a keyboard mode. Options include:
- Piano Keyboard. Two octave layout that mimics the white/black key pattern of a piano, with C mapped to Z and, an octave higher, Y.
- Custom Piano Map. Click Edit, then a piano key, then any combination of nodes to map to that key. Piano keys are laid out on the keyboard like Piano Keyboard mode; MIDI input also works.
- Isomorphic. Maps the approximate shape of nodes in the current view to letter and number keys.
- Isomorphic (Fuzzy). Same as isomorphic, except you don’t have to press the exact keys - it will play whichever node you are nearest to.


#### To play from MIDI input

1. Enable MIDI input.
2. Select your MIDI device and channel.
3. Play from your controller.

#### To use pattern playback

1. Open the Play menu to explore patterns, rhythms, change tempo, and adjust the note overlap with sustain/gate. Press Build and then Play to begin. Space bar starts and stops the pattern.
2. Choose the sequence, rhythm, and octave behavior.
4. Press Build and Play. Space bar toggles playback on and off.
5. Patterns update live, so you can change the pattern by changing the lattice nodes or view. 

#### To use the built-in LFO

1. Hold L and click and hold the mouse down on a node to start an LFO. 
2. The time between your mouse click and release will be the duration of the LFO.
3. Adjust rate and depth in the Synth menu.

#### To use the Looper

Tuning Lattice has a one-button looper. That button is the backslash \
1. One press arms recording. 
2. Recording begins when you play a note.
3. A second press enters Play mode, where the recording loops.
4. A third press enters Overdub mode, where you can record on top of the current loop.
5. Further presses alternate between Play and Overdub modes.
6. Clear with [

#### To use MIDI out

1. Enable MIDI Out.
2. Select the output device.
3. Route the output to an instrument that supports MPE retuning with per-note pitch bend.
4. Set the pitch-bend range to match the pitch-bend range on your instrument.
5. Play from the lattice and listen on the external synth instead of, or alongside, the internal sound engine.

### As a composition aid

The snapshot system makes Tuning Lattice useful as a compositional sketchbook and live scene manager.

#### What snapshots are good for

- Saving chord regions or drone states.
- Recalling different pattern setups.
- Capturing playable states for performance.

#### To build a snapshot-based scene set

1. Create a lattice state you want to keep. It can include playing nodes, LFOs, patterns, and loops.
2. Hold OPTION/ALT and press a number key to save that state in that slot.
3. Press that number key to recall it.
4. Repeat for alternate harmonies, tunings, or playback states.

#### To use snapshots during playback

1. Prepare several snapshots in advance.
2. Use Snapshot Options to decide what should be recalled: play state, view, synth settings, sequence state, keyboard mode, and LFO behavior.
2. Decide whether recalls should happen immediately or defer to the cycle end (for Patterns).
3. Enable Morph if you want connected sustained notes to bend between snapshot states.
4. Recall snapshots by clicking the slots or using the keyboard shortcuts.

#### A practical compositional use

1. Build one lattice for an entire piece or section.
2. Save contrasting harmonic regions as snapshots.
3. Give each snapshot its own held notes, playback pattern, or LFO state.
4. Explore moving between them to design harmonic progressions.

### As a practice aid

Tuning Lattice can act as a reference instrument for rehearsal, ear training, and intonation work. The accompanying Tuner is a live pitch-detection engine & visualizer to check your own tuning as you sing or play an instrument.

#### Useful practice scenarios

- Holding a drone while you sing or play against it.
- Checking the exact frequency of a target pitch.
- Comparing nearby just intervals.
- Using the tuner while practicing intonation.

#### To create a drone for practice

1. Turn on audio.
2. Toggle on one or more stable reference notes.
3. Shape the synth so the sound is steady and unobtrusive.
4. Practice against the drone while adjusting the fundamental or active harmony as needed.

#### To use the Tuner alongside the lattice

1. Open the Tuner.
2. Activate the microphone, and adjust input level under Microphone.
3. Adjust the ratios and labels as desired.
4. Click and drag on the graph to adjust range bounds, and scroll in/out to adjust range.
2. Sing or play your instrument and watch the meter.
3. Hold a reference in Tuning Lattice if needed (use headphones - extra tones in the speaker will reduce the accuracy of the pitch detection).

### As a page layout tool

Layout mode turns the lattice into a finished diagram. Create polished charts for scores or teaching materials and export to PDF or SVG.

#### What layout mode lets you control

- Page size and orientation.
- Position, scale, and spacing.
- Node size and shape.
- Text styles for titles, ratios, note labels, axis labels, and custom text.
- Which information layers are visible in the final diagram.

#### To make a presentation-ready diagram

1. Build and the lattice in the main editing view.
2. Switch into Layout mode.
3. Set the page size and orientation.
4. Click, drag, scroll, and use arrow keys to adjust zoom, spacing, and alignment so the lattice sits well on the page.
5. Freeze the view to begin editing.
5. Add a title and creator line if needed.
6. Drag elements to find an ideal arrangement.
6. Refine text sizes, spacing, fonts, and label visibility.
7. Preview the result with only the visual layers you want to publish.
8. Export as PDF or SVG.

#### A good workflow here

1. Finish the tuning logic first.
2. Hide any labels that are useful during editing but distracting in a final diagram.
3. Tune the typography and spacing last.
4. Export several variations if you want different versions for screen, print, or teaching.

### As a design surface for Scale Workshop

Tuning Lattice is also a front end for building tunings that you will later export into other tools. The most useful of these tools is the Scale Workshop, maintained by PLAINSOUND.

#### Why this is useful

- You can design the tuning visually before exporting it.
- You can hear the tuning while you build it.
- You can move from exploratory work to formal tuning files quickly.

#### To export to Scale Workshop

1. Build the tuning you want in Tuning Lattice.
2. Open the File menu.
3. Export to Scale Workshop.
4. Review the tuning there and convert it into the format you need.
5. Export or install the result for your target environment, such as `.scl`, MTS, Max/MSP, or Pure Data workflows.

