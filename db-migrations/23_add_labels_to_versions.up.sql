ALTER TABLE versions ADD COLUMN labels jsonb;
CREATE INDEX versions_labels_idx ON versions USING gin (labels jsonb_path_ops);