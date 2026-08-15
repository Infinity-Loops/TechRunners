export type Attachment = {
  path: string; // storage object path inside the bucket
  name: string;
  type: string; // mime
  size: number; // bytes
  kind: "image" | "video";
};

export type Report = {
  id: string;
  created_at: string;
  status: string;

  // reporter
  contact_email: string | null;
  player_name: string | null;

  // device / platform
  platform: string;
  device_model: string | null;
  os_version: string | null;
  app_version: string | null;
  network_type: string | null;
  region: string | null;

  // the problem
  problem_area: string;
  severity: string;
  frequency: string | null;
  title: string;
  description: string;
  steps: string | null;
  expected: string | null;
  actual_result: string | null;

  // meta
  attachments: Attachment[];
  user_agent: string | null;
  admin_notes: string | null;
};

/** An attachment with a freshly-signed, time-limited URL (admin views only). */
export type SignedAttachment = Attachment & { url: string | null };
