-- Add selection_phase column to applications table
ALTER TABLE applications
ADD COLUMN selection_phase smallint NOT NULL DEFAULT 1;

-- Add comment to explain the column
COMMENT ON COLUMN applications.selection_phase IS 'Selection phase (1-5): 1=research, 2=screening, 3=interviewing, 4=final, 5=offered';
