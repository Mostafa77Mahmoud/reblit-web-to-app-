import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Share,
  Edit,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  Eye
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Term {
  term_id: string;
  term_text: string;
  is_valid_sharia: boolean;
  sharia_issue?: string;
  reference_number?: string;
  modified_term?: string;
}

interface ResultsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  sessionData?: any;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ onBack, onNavigate, sessionData }) => {
  const { t, dir } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'terms' | 'recommendations'>('overview');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  // Mock data - replace with real session data
  const mockData = {
    session_id: 'session_123',
    compliance_stats: {
      total_terms: 24,
      compliant_count: 18,
      non_compliant_count: 6,
      compliance_percentage: 75
    },
    terms: [
      {
        term_id: '1',
        term_text: 'Interest rate shall be 5% per annum',
        is_valid_sharia: false,
        sharia_issue: 'Interest-based transaction (Riba)',
        reference_number: 'Quran 2:275',
        modified_term: 'Profit-sharing ratio shall be agreed upon between parties'
      },
      {
        term_id: '2', 
        term_text: 'Parties agree to share profits and losses',
        is_valid_sharia: true,
        reference_number: 'Quran 4:29'
      },
      {
        term_id: '3',
        term_text: 'Insurance coverage through conventional insurance',
        is_valid_sharia: false,
        sharia_issue: 'Conventional insurance involves uncertainty (Gharar)',
        reference_number: 'Hadith - Sahih Muslim',
        modified_term: 'Takaful coverage shall be arranged for protection'
      }
    ]
  };

  const data = sessionData || mockData;

  const getStatusColor = (isValid: boolean) => {
    return isValid ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const compliantTerms = data.terms.filter((term: Term) => term.is_valid_sharia);
  const nonCompliantTerms = data.terms.filter((term: Term) => !term.is_valid_sharia);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5" dir={dir}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={onBack}
                className="p-2 rounded-full bg-card shadow-lg"
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold">Analysis Results</h1>
                <p className="text-sm text-muted-foreground">Session: {data.session_id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {['overview', 'terms', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  selectedTab === tab
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Compliance Score */}
              <Card className="bg-gradient-to-r from-card via-card to-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Compliance Score</h3>
                      <p className="text-sm text-muted-foreground">Overall Shariaa compliance rating</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {Math.round(data.compliance_stats.compliance_percentage)}%
                      </div>
                      <Badge 
                        variant="secondary"
                        className={data.compliance_stats.compliance_percentage >= 80 ? 'bg-green-100 text-green-700' : 
                                  data.compliance_stats.compliance_percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'}
                      >
                        {data.compliance_stats.compliance_percentage >= 80 ? 'Excellent' :
                         data.compliance_stats.compliance_percentage >= 60 ? 'Good' : 'Needs Review'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Progress value={data.compliance_stats.compliance_percentage} className="h-3 mb-4" />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{data.compliance_stats.total_terms}</div>
                      <div className="text-xs text-muted-foreground">Total Terms</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{data.compliance_stats.compliant_count}</div>
                      <div className="text-xs text-muted-foreground">Compliant</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{data.compliance_stats.non_compliant_count}</div>
                      <div className="text-xs text-muted-foreground">Non-Compliant</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTab('terms')}>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Review Terms</h4>
                    <p className="text-sm text-muted-foreground">Examine individual clauses</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTab('recommendations')}>
                  <CardContent className="p-4 text-center">
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Get Suggestions</h4>
                    <p className="text-sm text-muted-foreground">AI-powered improvements</p>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Key Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Strong Compliance Foundation</p>
                      <p className="text-sm text-green-700">Most terms follow Islamic principles correctly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Interest-based clauses detected</p>
                      <p className="text-sm text-yellow-700">Replace with profit-sharing mechanisms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {data.terms.map((term: Term, index: number) => (
                <Card key={term.term_id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedTerm(expandedTerm === term.term_id ? null : term.term_id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              Term {index + 1}
                            </Badge>
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(term.is_valid_sharia)}`}>
                              {getStatusIcon(term.is_valid_sharia)}
                              <span>{term.is_valid_sharia ? 'Compliant' : 'Non-Compliant'}</span>
                            </div>
                          </div>
                          <p className="text-sm">{term.term_text}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedTerm === term.term_id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border/50"
                        >
                          <div className="p-4 space-y-4">
                            {!term.is_valid_sharia && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <h5 className="font-medium text-red-800 mb-1">Issue Identified</h5>
                                <p className="text-sm text-red-700">{term.sharia_issue}</p>
                                {term.reference_number && (
                                  <p className="text-xs text-red-600 mt-2">Reference: {term.reference_number}</p>
                                )}
                              </div>
                            )}

                            {term.modified_term && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h5 className="font-medium text-blue-800 mb-1">Suggested Modification</h5>
                                <p className="text-sm text-blue-700">{term.modified_term}</p>
                              </div>
                            )}

                            {term.is_valid_sharia && term.reference_number && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <h5 className="font-medium text-green-800 mb-1">Compliance Confirmed</h5>
                                <p className="text-xs text-green-600">Reference: {term.reference_number}</p>
                              </div>
                            )}

                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Ask Question
                              </Button>
                              {term.modified_term && (
                                <Button size="sm" variant="outline">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit Suggestion
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {selectedTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>AI Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nonCompliantTerms.map((term: Term, index: number) => (
                    <div key={term.term_id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">Replace Interest-based Term</h4>
                          <div className="space-y-2">
                            <div className="bg-red-50 p-2 rounded border-l-4 border-red-400">
                              <p className="text-sm text-red-800">Original: {term.term_text}</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded border-l-4 border-green-400">
                              <p className="text-sm text-green-800">Suggested: {term.modified_term}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" className="bg-primary">
                              Apply Suggestion
                            </Button>
                            <Button size="sm" variant="outline">
                              Customize
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Generate Compliant Contract</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a new version with all recommendations applied
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Contract
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsScreen;