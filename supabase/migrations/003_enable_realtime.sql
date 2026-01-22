-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE processing_logs;

-- This allows clients to subscribe to changes in reports and processing_logs tables
