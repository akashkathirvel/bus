'use client';

import styles from './index.module.css';

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.scene}>
        {/* Sky */}
        <div className={styles.sky}>
          <div className={styles.clouds}>
            <div className={styles.cloud}></div>
            <div className={styles.cloud}></div>
            <div className={styles.cloud}></div>
          </div>
        </div>
        
        {/* Mountains */}
        <div className={styles.mountains}>
          <div className={styles.mountain}></div>
          <div className={styles.mountain}></div>
          <div className={styles.mountain}></div>
        </div>
        
        {/* River */}
        <div className={styles.river}>
          <div className={styles.waterFlow}></div>
          <div className={styles.waterFlow}></div>
          <div className={styles.waterFlow}></div>
        </div>
        
        {/* Trees */}
        <div className={styles.trees}>
          <div className={styles.tree}>
            <div className={styles.treeTrunk}></div>
            <div className={styles.treeLeaves}></div>
          </div>
          <div className={styles.tree}>
            <div className={styles.treeTrunk}></div>
            <div className={styles.treeLeaves}></div>
          </div>
          <div className={styles.tree}>
            <div className={styles.treeTrunk}></div>
            <div className={styles.treeLeaves}></div>
          </div>
          <div className={styles.tree}>
            <div className={styles.treeTrunk}></div>
            <div className={styles.treeLeaves}></div>
          </div>
          <div className={styles.tree}>
            <div className={styles.treeTrunk}></div>
            <div className={styles.treeLeaves}></div>
          </div>
        </div>
        
        {/* Road */}
        <div className={styles.road}>
          <div className={styles.roadLines}>
            <div className={styles.roadLine}></div>
            <div className={styles.roadLine}></div>
            <div className={styles.roadLine}></div>
            <div className={styles.roadLine}></div>
            <div className={styles.roadLine}></div>
          </div>
        </div>
        
        {/* Bus */}
        <div className={styles.bus}>
          <div className={styles.busBody}>
            <div className={styles.busWindows}>
              <div className={styles.busWindow}></div>
              <div className={styles.busWindow}></div>
              <div className={styles.busWindow}></div>
              <div className={styles.busWindow}></div>
            </div>
            <div className={styles.busDoor}></div>
            <div className={styles.busWheels}>
              <div className={styles.busWheel}></div>
              <div className={styles.busWheel}></div>
            </div>
            <div className={styles.busHeadlights}>
              <div className={styles.busHeadlight}></div>
              <div className={styles.busHeadlight}></div>
            </div>
          </div>
        </div>
        
        {/* Grass */}
        <div className={styles.grass}>
          <div className={styles.grassBlade}></div>
          <div className={styles.grassBlade}></div>
          <div className={styles.grassBlade}></div>
          <div className={styles.grassBlade}></div>
          <div className={styles.grassBlade}></div>
          <div className={styles.grassBlade}></div>
          <div className={styles.grassBlade}></div>
          <div className={styles.grassBlade}></div>
        </div>
        
        {/* Loading Text */}
        <div className={styles.loadingText}>
          <span>Sit Back & Relax</span>
          <div className={styles.dots}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
