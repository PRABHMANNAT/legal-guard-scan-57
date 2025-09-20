export interface ViolationRecord {
  id: string;
  productName: string;
  productImage?: string;
  productUrl?: string;
  brand: string;
  category: string;
  platform: string;
  dateScanned: Date;
  scannedBy: string;
  
  // Compliance details
  complianceStatus: 'compliant' | 'violation' | 'pending' | 'resolved' | 'dismissed';
  violationType: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidenceScore: number;
  
  // LMPC specific violations
  missingFields: string[];
  fieldViolations: {
    field: string;
    issue: string;
    severity: 'minor' | 'major' | 'critical';
  }[];
  
  // Tracking
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  notes: string[];
  
  // Audit trail
  statusHistory: StatusChange[];
  actionHistory: UserAction[];
  
  // Resolution
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusChange {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

export interface UserAction {
  id: string;
  action: 'created' | 'updated' | 'assigned' | 'commented' | 'resolved' | 'dismissed' | 'tagged' | 'exported';
  performedBy: string;
  performedAt: Date;
  details: string;
  metadata?: Record<string, any>;
}

export interface ViolationFilters {
  search: string;
  complianceStatus: string[];
  severity: string[];
  platform: string[];
  category: string[];
  violationType: string[];
  assignedTo: string[];
  priority: string[];
  tags: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

export interface ViolationSortConfig {
  field: 'dateScanned' | 'productName' | 'severity' | 'priority' | 'confidenceScore' | 'platform' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface ViolationStats {
  total: number;
  byStatus: Record<string, number>;
  bySeverity: Record<string, number>;
  byPlatform: Record<string, number>;
  byCategory: Record<string, number>;
  recentTrends: {
    period: string;
    violations: number;
    resolved: number;
  }[];
}