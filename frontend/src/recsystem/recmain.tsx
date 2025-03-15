import { SongRecommendationModel } from "./ModelLogic";
import { idealRanges, sampleData, trackList } from "./sampledata";

// Initialize the song recommendation model
const model = new SongRecommendationModel(idealRanges);

// Step 1
console.log("\nStep 1: Compute EMA");
const ema = model.calculateEWMA(sampleData);
console.log("EMA Values:", ema);

// Step 2
console.log("\nStep 2: Compute Target Mental State");
const target = model.calculateTargetMentalState();
console.log("Target State:", target);

// Step 3
console.log("\nStep 3: Compute Weight Matrix");
const deltaT = target.map((t, i) => t - ema[i]);
console.log("ΔT (Difference between Target and EMA):", deltaT);

const weightMatrix = model.computeWeightMatrix(deltaT, trackList[0]);
console.log("Weight Matrix (W):", weightMatrix);

// Step 4
console.log("\nStep 4: Compute Ideal Song Properties");
const idealProps = model.computeIdealSongProps(weightMatrix, deltaT, ema);
console.log("Ideal Song Properties (V_target):", idealProps);

// Step 5
console.log("\n Step 5: Find Best Matching Song");
const { bestSong, sortedSongIds } = model.findBestMatchingSong(idealProps, trackList);
console.log("\n Best Recommended Song:", bestSong);
console.log("\n Sorted Song IDs by Distance:", sortedSongIds);
