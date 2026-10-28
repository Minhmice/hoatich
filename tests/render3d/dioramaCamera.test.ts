import { describe, expect, it } from 'vitest';
import { DioramaCamera, createDioramaCamera, getViewPose } from '../../src/render3d/DioramaCamera';

describe('DioramaCamera', () => {
  const aspectLandscape = 16 / 9;
  const aspectPortrait = 9 / 16;

  describe('getViewPose', () => {
    it('produces genuinely different positions and targets for counter and workspace', () => {
      const counterPose = getViewPose('counter', aspectLandscape);
      const workspacePose = getViewPose('workspace', aspectLandscape);

      expect(counterPose.position.distanceTo(workspacePose.position)).toBeGreaterThan(2);
      expect(counterPose.target.distanceTo(workspacePose.target)).toBeGreaterThan(1);
    });

    it('frames workspace table at origin', () => {
      const workspacePose = getViewPose('workspace', aspectLandscape);
      expect(workspacePose.target.x).toBeCloseTo(0);
      expect(workspacePose.target.y).toBeCloseTo(0);
      expect(workspacePose.target.z).toBeCloseTo(0);
    });

    it('adjusts position for narrow portrait aspects without altering target', () => {
      const widePose = getViewPose('workspace', aspectLandscape);
      const tallPose = getViewPose('workspace', aspectPortrait);

      expect(tallPose.target.distanceTo(widePose.target)).toBeCloseTo(0);
      expect(tallPose.position.length()).toBeGreaterThan(widePose.position.length());
    });
  });

  describe('interpolation and transition lifecycle', () => {
    it('interpolates smoothly to desired pose and finishes at exact endpoint', () => {
      const camera = new DioramaCamera('counter', aspectLandscape);
      camera.setView('workspace', false);

      expect(camera.transitioning).toBe(true);

      // Advance halfway
      camera.update(250);
      expect(camera.transitioning).toBe(true);
      const desiredWorkspace = getViewPose('workspace', aspectLandscape);
      const initialCounter = getViewPose('counter', aspectLandscape);

      // Verify position is between initial and target
      const distFromStart = camera.position.distanceTo(initialCounter.position);
      const distFromEnd = camera.position.distanceTo(desiredWorkspace.position);
      expect(distFromStart).toBeGreaterThan(0.5);
      expect(distFromEnd).toBeGreaterThan(0.5);

      // Advance past duration (500ms total)
      camera.update(300);
      expect(camera.transitioning).toBe(false);

      expect(camera.position.x).toBeCloseTo(desiredWorkspace.position.x, 3);
      expect(camera.position.y).toBeCloseTo(desiredWorkspace.position.y, 3);
      expect(camera.position.z).toBeCloseTo(desiredWorkspace.position.z, 3);

      expect(camera.currentTarget.x).toBeCloseTo(desiredWorkspace.target.x, 3);
      expect(camera.currentTarget.y).toBeCloseTo(desiredWorkspace.target.y, 3);
      expect(camera.currentTarget.z).toBeCloseTo(desiredWorkspace.target.z, 3);
    });

    it('interrupts transition from actual current live pose without teleporting', () => {
      const camera = new DioramaCamera('counter', aspectLandscape);
      camera.setView('workspace', false);

      // Advance partially (e.g. 200ms)
      camera.update(200);
      const interruptedPos = camera.position.clone();
      const interruptedTarget = camera.currentTarget.clone();

      // Interrupt: reverse view back to counter
      camera.setView('counter', false);
      expect(camera.transitioning).toBe(true);

      // Immediately after interrupt, position must still match interrupted pose
      expect(camera.position.distanceTo(interruptedPos)).toBeCloseTo(0);
      expect(camera.currentTarget.distanceTo(interruptedTarget)).toBeCloseTo(0);

      // Step 10ms towards counter - distance from interruptedPos should be small and continuous
      camera.update(10);
      expect(camera.position.distanceTo(interruptedPos)).toBeLessThan(1.0);
    });

    it('recalculates active destination when resized while retaining target', () => {
      const camera = new DioramaCamera('workspace', aspectLandscape);
      expect(camera.aspect).toBeCloseTo(aspectLandscape);

      camera.resize(aspectPortrait);
      expect(camera.aspect).toBeCloseTo(aspectPortrait);

      const expectedPose = getViewPose('workspace', aspectPortrait);
      expect(camera.position.x).toBeCloseTo(expectedPose.position.x, 3);
      expect(camera.position.y).toBeCloseTo(expectedPose.position.y, 3);
      expect(camera.position.z).toBeCloseTo(expectedPose.position.z, 3);
      expect(camera.currentTarget.distanceTo(expectedPose.target)).toBeCloseTo(0);
    });

    it('applies reduced motion immediately with no pending movement', () => {
      const camera = new DioramaCamera('counter', aspectLandscape);
      camera.setView('workspace', true);

      expect(camera.transitioning).toBe(false);
      const expectedPose = getViewPose('workspace', aspectLandscape);

      expect(camera.position.x).toBeCloseTo(expectedPose.position.x, 3);
      expect(camera.position.y).toBeCloseTo(expectedPose.position.y, 3);
      expect(camera.position.z).toBeCloseTo(expectedPose.position.z, 3);

      const posBeforeUpdate = camera.position.clone();
      camera.update(500);
      expect(camera.position.distanceTo(posBeforeUpdate)).toBe(0);
    });

    it('does not restart transition when set to unchanged view', () => {
      const camera = new DioramaCamera('workspace', aspectLandscape);
      expect(camera.transitioning).toBe(false);

      camera.setView('workspace', false);
      expect(camera.transitioning).toBe(false);

      // If mid-transition, requesting same view again does not restart progress
      camera.setView('counter', false);
      camera.update(250);
      const midPos = camera.position.clone();

      camera.setView('counter', false);
      // Position unchanged, did not reset to start
      expect(camera.position.distanceTo(midPos)).toBeCloseTo(0);
    });

    it('advances fractionally on sub-millisecond deltas without premature completion', () => {
      const camera = new DioramaCamera('counter', aspectLandscape);
      camera.setView('workspace', false);
      expect(camera.transitioning).toBe(true);

      // 0.8ms update (typical for 144Hz+ or high sub-frame rate tick)
      camera.update(0.8);
      expect(camera.transitioning).toBe(true);

      const counterPose = getViewPose('counter', aspectLandscape);
      expect(camera.position.distanceTo(counterPose.position)).toBeLessThan(0.05);
    });

    it('snaps immediately when reduced motion requested mid-transition to same target view', () => {
      const camera = new DioramaCamera('counter', aspectLandscape);
      camera.setView('workspace', false);
      expect(camera.transitioning).toBe(true);

      camera.update(200);
      expect(camera.transitioning).toBe(true);

      camera.setView('workspace', true);
      expect(camera.transitioning).toBe(false);

      const workspacePose = getViewPose('workspace', aspectLandscape);
      expect(camera.position.x).toBeCloseTo(workspacePose.position.x, 3);
      expect(camera.position.y).toBeCloseTo(workspacePose.position.y, 3);
      expect(camera.position.z).toBeCloseTo(workspacePose.position.z, 3);
      expect(camera.currentTarget.distanceTo(workspacePose.target)).toBeCloseTo(0);
    });
  });

  describe('createDioramaCamera factory', () => {
    it('returns a configured DioramaCamera instance', () => {
      const cam = createDioramaCamera();
      expect(cam).toBeInstanceOf(DioramaCamera);
      expect(cam.activeView).toBe('workspace');
    });
  });
});
