import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ViolationRecord, UserAction, StatusChange, ViolationFilters, ViolationSortConfig } from '@/types/violations';
import { ScanResult } from '@/types/scanner';

interface ViolationsContextType {
  violations: ViolationRecord[];
  addViolationFromScan: (scanResult: ScanResult, productName: string, productImage?: string, productUrl?: string) => void;
  updateViolation: (id: string, updates: Partial<ViolationRecord>) => void;
  deleteViolation: (id: string) => void;
  addUserAction: (violationId: string, action: Omit<UserAction, 'id' | 'performedAt'>) => void;
  changeStatus: (violationId: string, newStatus: ViolationRecord['complianceStatus'], reason?: string) => void;
  getFilteredViolations: (filters: ViolationFilters, sort?: ViolationSortConfig) => ViolationRecord[];
  getViolationStats: () => any;
}

const ViolationsContext = createContext<ViolationsContextType | undefined>(undefined);

// Mock data with 20-Sep-2025 dates
const mockViolations: ViolationRecord[] = [
  {
    id: 'v1',
    productName: 'Cetaphil Gentle Skin Cleanser 250 mL',
    productUrl: 'https://www.amazon.in/dp/B01CCGW4LC',
    brand: 'Cetaphil',
    category: 'Beauty & Personal Care',
    platform: 'Amazon',
    dateScanned: new Date('2025-09-20'),
    scannedBy: 'AI Scanner',
    complianceStatus: 'violation',
    violationType: ['Missing Manufacturer Info', 'Missing Consumer Care', 'Missing Date of Manufacture'],
    severity: 'high',
    confidenceScore: 0.46,
    missingFields: ['manufacturer', 'consumer_care', 'dom_or_doi', 'country_of_origin'],
    fieldViolations: [
      { field: 'manufacturer', issue: 'Name & address not visible - back label scan needed', severity: 'major' },
      { field: 'consumer_care', issue: 'Consumer care details missing', severity: 'major' },
      { field: 'dom_or_doi', issue: 'Date of manufacture/import not visible', severity: 'major' },
      { field: 'country_of_origin', issue: 'Country of origin missing', severity: 'major' }
    ],
    assignedTo: 'compliance.team@assurex.in',
    priority: 'high',
    tags: ['LMPC', 'Amazon', 'Beauty'],
    notes: [],
    statusHistory: [
      { id: 'sh1', fromStatus: '', toStatus: 'violation', changedBy: 'AI Scanner', changedAt: new Date('2025-09-20'), reason: 'Auto-detected violations' }
    ],
    actionHistory: [
      { id: 'ah1', action: 'created', performedBy: 'AI Scanner', performedAt: new Date('2025-09-20'), details: 'Violation record created from scan' }
    ],
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20')
  },
  {
    id: 'v2',
    productName: 'Fire-Boltt Rise Smart Watch',
    productUrl: 'https://www.amazon.in/dp/B0D2K6JJNX',
    brand: 'Fire-Boltt',
    category: 'Electronics',
    platform: 'Amazon',
    dateScanned: new Date('2025-09-20'),
    scannedBy: 'AI Scanner',
    complianceStatus: 'violation',
    violationType: ['Missing Importer Details', 'Missing Consumer Care', 'Missing COO'],
    severity: 'high',
    confidenceScore: 0.35,
    missingFields: ['manufacturer', 'consumer_care', 'dom_or_doi', 'country_of_origin'],
    fieldViolations: [
      { field: 'manufacturer', issue: 'Importer details not visible - box packaging required', severity: 'major' },
      { field: 'consumer_care', issue: 'Consumer care details missing', severity: 'major' },
      { field: 'country_of_origin', issue: 'Country of origin missing - typically on electronics box', severity: 'major' }
    ],
    assignedTo: 'electronics.team@assurex.in',
    priority: 'high',
    tags: ['LMPC', 'Electronics', 'Wearables'],
    notes: [],
    statusHistory: [
      { id: 'sh2', fromStatus: '', toStatus: 'violation', changedBy: 'AI Scanner', changedAt: new Date('2025-09-20'), reason: 'Auto-detected violations' }
    ],
    actionHistory: [
      { id: 'ah2', action: 'created', performedBy: 'AI Scanner', performedAt: new Date('2025-09-20'), details: 'Violation record created from scan' }
    ],
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20')
  },
  {
    id: 'v3',
    productName: 'MATATA MTMPX12 Bluetooth Speaker',
    productUrl: 'https://www.reliancedigital.in/product/matata-mtmpx12',
    brand: 'MATATA',
    category: 'Electronics',
    platform: 'Reliance Digital',
    dateScanned: new Date('2025-09-20'),
    scannedBy: 'AI Scanner',
    complianceStatus: 'compliant',
    violationType: [],
    severity: 'low',
    confidenceScore: 0.90,
    missingFields: [],
    fieldViolations: [],
    assignedTo: 'compliance.team@assurex.in',
    priority: 'low',
    tags: ['LMPC', 'Electronics', 'Audio', 'Compliant'],
    notes: ['All mandatory LMPC declarations present'],
    statusHistory: [
      { id: 'sh3', fromStatus: '', toStatus: 'compliant', changedBy: 'AI Scanner', changedAt: new Date('2025-09-20'), reason: 'All fields compliant' }
    ],
    actionHistory: [
      { id: 'ah3', action: 'created', performedBy: 'AI Scanner', performedAt: new Date('2025-09-20'), details: 'Compliant product record created' }
    ],
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20')
  }
];

export function ViolationsProvider({ children }: { children: ReactNode }) {
  const [violations, setViolations] = useState<ViolationRecord[]>(mockViolations);

  const addViolationFromScan = useCallback((
    scanResult: ScanResult,
    productName: string,
    productImage?: string,
    productUrl?: string
  ) => {
    if (scanResult.summary_status === 'compliant') return;

    const newViolation: ViolationRecord = {
      id: `v${Date.now()}`,
      productName,
      productImage,
      productUrl,
      brand: extractBrandFromName(productName),
      category: inferCategory(productName),
      platform: inferPlatform(productUrl),
      dateScanned: new Date('2025-09-20'), // Fixed date as requested
      scannedBy: 'AI Scanner',
      complianceStatus: scanResult.summary_status as 'violation',
      violationType: scanResult.violations.map(v => v.rule),
      severity: getSeverityFromViolations(scanResult.violations),
      confidenceScore: scanResult.confidence_avg,
      missingFields: Object.entries(scanResult.fields)
        .filter(([_, field]) => field.status === 'missing')
        .map(([key, _]) => key),
      fieldViolations: scanResult.violations.map(v => ({
        field: v.field,
        issue: v.rule,
        severity: v.severity
      })),
      assignedTo: 'compliance.team@assurex.in',
      priority: getSeverityFromViolations(scanResult.violations) === 'critical' ? 'urgent' : 'high',
      tags: ['LMPC', inferPlatform(productUrl), inferCategory(productName)],
      notes: [],
      statusHistory: [{
        id: `sh${Date.now()}`,
        fromStatus: '',
        toStatus: scanResult.summary_status,
        changedBy: 'AI Scanner',
        changedAt: new Date('2025-09-20'),
        reason: 'Auto-detected violations'
      }],
      actionHistory: [{
        id: `ah${Date.now()}`,
        action: 'created',
        performedBy: 'AI Scanner',
        performedAt: new Date('2025-09-20'),
        details: 'Violation record created from scan'
      }],
      createdAt: new Date('2025-09-20'),
      updatedAt: new Date('2025-09-20')
    };

    setViolations(prev => [newViolation, ...prev]);
  }, []);

  const updateViolation = useCallback((id: string, updates: Partial<ViolationRecord>) => {
    setViolations(prev => prev.map(v => v.id === id ? { ...v, ...updates, updatedAt: new Date() } : v));
  }, []);

  const deleteViolation = useCallback((id: string) => {
    setViolations(prev => prev.filter(v => v.id !== id));
  }, []);

  const addUserAction = useCallback((violationId: string, action: Omit<UserAction, 'id' | 'performedAt'>) => {
    const newAction: UserAction = {
      ...action,
      id: `ua${Date.now()}`,
      performedAt: new Date()
    };

    setViolations(prev => prev.map(v => 
      v.id === violationId 
        ? { ...v, actionHistory: [newAction, ...v.actionHistory], updatedAt: new Date() }
        : v
    ));
  }, []);

  const changeStatus = useCallback((
    violationId: string, 
    newStatus: ViolationRecord['complianceStatus'], 
    reason?: string
  ) => {
    setViolations(prev => prev.map(v => {
      if (v.id !== violationId) return v;
      
      const statusChange: StatusChange = {
        id: `sc${Date.now()}`,
        fromStatus: v.complianceStatus,
        toStatus: newStatus,
        changedBy: 'Current User',
        changedAt: new Date(),
        reason
      };

      const userAction: UserAction = {
        id: `ua${Date.now()}`,
        action: 'updated',
        performedBy: 'Current User',
        performedAt: new Date(),
        details: `Status changed from ${v.complianceStatus} to ${newStatus}`
      };

      return {
        ...v,
        complianceStatus: newStatus,
        statusHistory: [statusChange, ...v.statusHistory],
        actionHistory: [userAction, ...v.actionHistory],
        updatedAt: new Date(),
        ...(newStatus === 'resolved' && { resolvedAt: new Date(), resolvedBy: 'Current User' })
      };
    }));
  }, []);

  const getFilteredViolations = useCallback((
    filters: ViolationFilters,
    sort?: ViolationSortConfig
  ): ViolationRecord[] => {
    let filtered = violations;

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(v =>
        v.productName.toLowerCase().includes(search) ||
        v.brand.toLowerCase().includes(search) ||
        v.violationType.some(vt => vt.toLowerCase().includes(search))
      );
    }

    if (filters.complianceStatus.length > 0) {
      filtered = filtered.filter(v => filters.complianceStatus.includes(v.complianceStatus));
    }

    if (filters.severity.length > 0) {
      filtered = filtered.filter(v => filters.severity.includes(v.severity));
    }

    if (filters.platform.length > 0) {
      filtered = filtered.filter(v => filters.platform.includes(v.platform));
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter(v => filters.category.includes(v.category));
    }

    // Apply sorting
    if (sort) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sort.field];
        let bVal = b[sort.field];

        if (aVal instanceof Date) aVal = aVal.getTime();
        if (bVal instanceof Date) bVal = bVal.getTime();
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (sort.direction === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [violations]);

  const getViolationStats = useCallback(() => {
    const byStatus = violations.reduce((acc, v) => {
      acc[v.complianceStatus] = (acc[v.complianceStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySeverity = violations.reduce((acc, v) => {
      acc[v.severity] = (acc[v.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPlatform = violations.reduce((acc, v) => {
      acc[v.platform] = (acc[v.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: violations.length,
      byStatus,
      bySeverity,
      byPlatform
    };
  }, [violations]);

  return (
    <ViolationsContext.Provider value={{
      violations,
      addViolationFromScan,
      updateViolation,
      deleteViolation,
      addUserAction,
      changeStatus,
      getFilteredViolations,
      getViolationStats
    }}>
      {children}
    </ViolationsContext.Provider>
  );
}

export function useViolations() {
  const context = useContext(ViolationsContext);
  if (!context) {
    throw new Error('useViolations must be used within ViolationsProvider');
  }
  return context;
}

// Helper functions
function extractBrandFromName(productName: string): string {
  const brandPatterns = [
    /^([A-Za-z]+)/,  // First word
    /(Cetaphil|Fire-Boltt|MATATA|Nike|Samsung|Apple)/i
  ];
  
  for (const pattern of brandPatterns) {
    const match = productName.match(pattern);
    if (match) return match[1];
  }
  
  return 'Unknown';
}

function inferCategory(productName: string): string {
  const categoryMap = {
    'Beauty': ['cleanser', 'serum', 'cream', 'lotion', 'soap'],
    'Electronics': ['watch', 'phone', 'speaker', 'headphone', 'tablet'],
    'Fashion': ['shoes', 'shirt', 'pants', 'dress', 'jacket'],
    'Food': ['snack', 'drink', 'supplement', 'vitamin']
  };

  const name = productName.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

function inferPlatform(url?: string): string {
  if (!url) return 'Unknown';
  
  if (url.includes('amazon')) return 'Amazon';
  if (url.includes('flipkart')) return 'Flipkart';
  if (url.includes('reliance')) return 'Reliance Digital';
  if (url.includes('myntra')) return 'Myntra';
  if (url.includes('nykaa')) return 'Nykaa';
  
  return 'Other';
}

function getSeverityFromViolations(violations: any[]): 'low' | 'medium' | 'high' | 'critical' {
  if (violations.some(v => v.severity === 'critical')) return 'critical';
  if (violations.some(v => v.severity === 'major')) return 'high';
  if (violations.some(v => v.severity === 'minor')) return 'medium';
  return 'low';
}