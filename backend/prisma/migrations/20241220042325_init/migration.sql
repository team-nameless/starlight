-- CreateTable
CREATE TABLE "Player" (
    "Id" TEXT NOT NULL,
    "NumericId" BIGINT NOT NULL,
    "Handle" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "HashedPassword" TEXT NOT NULL,
    "HashedTemporaryPassword" TEXT NOT NULL,
    "TotalPlayTime" BIGINT NOT NULL,
    "Level" BIGINT NOT NULL,
    "ExpOfLevel" BIGINT NOT NULL,
    "CreationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "Id" BIGINT NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Detail" TEXT NOT NULL,
    "FavorText" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Score" (
    "Id" BIGSERIAL NOT NULL,
    "TrackId" BIGINT NOT NULL,
    "TrackName" VARCHAR(16384) NOT NULL,
    "TotalPoints" BIGINT NOT NULL,
    "Accuracy" DOUBLE PRECISION NOT NULL,
    "Critical" BIGINT NOT NULL,
    "MaxCombo" BIGINT NOT NULL,
    "Grade" VARCHAR(10) NOT NULL,
    "Perfect" BIGINT NOT NULL,
    "Good" BIGINT NOT NULL,
    "Bad" BIGINT NOT NULL,
    "Miss" BIGINT NOT NULL,
    "RawJson" TEXT NOT NULL,
    "SubmissionDate" TIMESTAMP(3) NOT NULL,
    "PlayerId" TEXT NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "Id" BIGSERIAL NOT NULL,
    "KeyCode1" INTEGER NOT NULL,
    "KeyCode2" INTEGER NOT NULL,
    "KeyCode3" INTEGER NOT NULL,
    "KeyCode4" INTEGER NOT NULL,
    "MasterVolume" INTEGER NOT NULL,
    "MusicVolume" INTEGER NOT NULL,
    "SoundEffectVolume" INTEGER NOT NULL,
    "Offset" INTEGER NOT NULL,
    "FrameRate" INTEGER NOT NULL,
    "PlayerId" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "_Friendship" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AchievementToPlayer" (
    "A" BIGINT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting_PlayerId_key" ON "Setting"("PlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "_Friendship_AB_unique" ON "_Friendship"("A", "B");

-- CreateIndex
CREATE INDEX "_Friendship_B_index" ON "_Friendship"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AchievementToPlayer_AB_unique" ON "_AchievementToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_AchievementToPlayer_B_index" ON "_AchievementToPlayer"("B");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_PlayerId_fkey" FOREIGN KEY ("PlayerId") REFERENCES "Player"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_PlayerId_fkey" FOREIGN KEY ("PlayerId") REFERENCES "Player"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendship" ADD CONSTRAINT "_Friendship_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendship" ADD CONSTRAINT "_Friendship_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementToPlayer" ADD CONSTRAINT "_AchievementToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementToPlayer" ADD CONSTRAINT "_AchievementToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
