import fs from "fs";

console.log("🛠️ Starting PK10 split migration...");

// 1. Read your massive JSON matrix
const fileUrl = new URL("../data/fareMatrices/mrtPKFare.json", import.meta.url);
const rawData = fs.readFileSync(fileUrl);
const distanceFares = JSON.parse(rawData);

const newMatrix = {};

// 2. Loop through every single station in the matrix
for (const [sourceStation, targetList] of Object.entries(distanceFares)) {
  const newTargets = {};

  // 3. Fix the targets inside the object
  for (const [targetStation, fare] of Object.entries(targetList)) {
    if (targetStation === "PK10") {
      newTargets["PK10_U"] = fare;
      newTargets["PK10_L"] = fare;
    } else {
      newTargets[targetStation] = fare;
    }
  }

  // 4. Fix the source keys at the top level
  if (sourceStation === "PK10") {
    newMatrix["PK10_U"] = newTargets;
    newMatrix["PK10_L"] = newTargets;
  } else {
    newMatrix[sourceStation] = newTargets;
  }
}

// 5. Overwrite the file with the perfectly split data
fs.writeFileSync(fileUrl, JSON.stringify(newMatrix, null, 2));

console.log("✅ Migration complete! Your JSON has been upgraded.");
