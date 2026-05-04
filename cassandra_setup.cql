CREATE KEYSPACE task8_demo
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE task8_demo;

CREATE TABLE user_events (
  user_id text,
  event_time timestamp,
  event_type text,
  details text,
  PRIMARY KEY (user_id, event_time)
) WITH CLUSTERING ORDER BY (event_time DESC)
AND compaction = {'class': 'SizeTieredCompactionStrategy'};
