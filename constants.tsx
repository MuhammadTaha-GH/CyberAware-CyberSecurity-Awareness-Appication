
import { Category, SecurityUpdate, UserProfile } from './types';

// Fix: Using UserProfile instead of User and aligning properties with types.ts
export const INITIAL_USERS: UserProfile[] = [
  { id: '1', email: 'admin@cyberaware.io', role: 'admin', created_at: '2024-01-01' },
  { id: '2', email: 'john@gmail.com', role: 'user', created_at: '2024-02-15' },
];

// Fix: Using SecurityUpdate instead of Post and aligning properties with types.ts
export const INITIAL_POSTS: SecurityUpdate[] = [
  {
    id: 'p1',
    title: 'Recognizing Advanced Phishing Techniques',
    summary: 'Phishing has evolved beyond simple emails. Learn about spear phishing and whaling. Phishing attacks remain the most common entry point for cyberattacks. Modern attackers use deepfake audio, highly personalized LinkedIn data, and sophisticated redirects to bypass MFA. Always verify the source and never click on suspicious links.',
    type: Category.PHISHING,
    severity: 'High',
    created_by: '1',
    created_at: '2024-03-01'
  },
  {
    id: 'p2',
    title: 'Cloud Security Best Practices 2024',
    summary: 'Secure your AWS, Azure, and Google Cloud environments with these fundamental steps. Misconfigured S3 buckets are still a leading cause of data leaks. Implement IAM least privilege, enable CloudTrail logging, and use VPC service controls to minimize your attack surface.',
    type: Category.CLOUD,
    severity: 'Critical',
    created_by: '1',
    created_at: '2024-03-05'
  },
  {
    id: 'p3',
    title: 'The Rise of Ransomware-as-a-Service',
    summary: 'Understanding how cybercriminals lease their code to affiliates for global attacks. RaaS has lowered the barrier for entry in cybercrime. Affiliate groups now handle the breach while the core developers maintain the decryption software. Protection requires offline backups and robust endpoint detection.',
    type: Category.MALWARE,
    severity: 'High',
    created_by: '1',
    created_at: '2024-03-10'
  }
];
