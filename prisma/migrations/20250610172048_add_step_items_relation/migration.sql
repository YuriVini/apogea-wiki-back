-- CreateTable
CREATE TABLE "_step_items" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_step_items_AB_unique" ON "_step_items"("A", "B");

-- CreateIndex
CREATE INDEX "_step_items_B_index" ON "_step_items"("B");

-- AddForeignKey
ALTER TABLE "_step_items" ADD CONSTRAINT "_step_items_A_fkey" FOREIGN KEY ("A") REFERENCES "other_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_step_items" ADD CONSTRAINT "_step_items_B_fkey" FOREIGN KEY ("B") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
