import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Search, 
  Filter,
  Calendar,
  FileText,
  TrendingUp,
  Download,
  Share,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  Clock,
  Building2,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HistoryItem {
  id: string;
  title: string;
  type: 'Investment' | 'Loan' | 'Partnership' | 'Insurance' | 'Trade';
  date: string;
  time: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  score: number;
  amount?: string;
  institution: string;
  tags: string[];
  thumbnail?: string;
}

interface HistoryScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onNavigate }) => {
  const { t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'compliant' | 'warning' | 'non-compliant'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');

  const historyItems: HistoryItem[] = [
    {
      id: '1',
      title: 'Murabaha Investment Contract',
      type: 'Investment',
      date: '2024-12-20',
      time: '14:30',
      status: 'compliant',
      score: 94,
      amount: '$250,000',
      institution: 'Islamic Development Bank',
      tags: ['Murabaha', 'Real Estate', 'Halal']
    },
    {
      id: '2',
      title: 'Partnership Agreement - Tech Startup',
      type: 'Partnership',
      date: '2024-12-19',
      time: '09:15',
      status: 'warning',
      score: 76,
      amount: '$100,000',
      institution: 'Al-Baraka Ventures',
      tags: ['Musharakah', 'Technology', 'Review Required']
    },
    {
      id: '3',
      title: 'Trade Finance Agreement',
      type: 'Trade',
      date: '2024-12-18',
      time: '16:45',
      status: 'compliant',
      score: 89,
      amount: '$500,000',
      institution: 'Dubai Islamic Bank',
      tags: ['Murabaha', 'Export', 'Commodities']
    },
    {
      id: '4',
      title: 'Insurance Policy - Takaful',
      type: 'Insurance',
      date: '2024-12-17',
      time: '11:20',
      status: 'compliant',
      score: 92,
      amount: '$50,000',
      institution: 'Takaful Insurance Co.',
      tags: ['Takaful', 'Life Insurance', 'Halal']
    },
    {
      id: '5',
      title: 'Conventional Loan Agreement',
      type: 'Loan',
      date: '2024-12-16',
      time: '13:10',
      status: 'non-compliant',
      score: 23,
      amount: '$75,000',
      institution: 'Standard Bank',
      tags: ['Interest-based', 'Haram', 'Non-compliant']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'non-compliant': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'non-compliant': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Investment': return <TrendingUp className="w-4 h-4" />;
      case 'Loan': return <DollarSign className="w-4 h-4" />;
      case 'Partnership': return <Building2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredItems = historyItems
    .filter(item => 
      (selectedFilter === 'all' || item.status === selectedFilter) &&
      (searchQuery === '' || 
       item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.score - a.score;
        case 'name': return a.title.localeCompare(b.title);
        case 'date':
        default: return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
      }
    });

  const stats = {
    total: historyItems.length,
    compliant: historyItems.filter(item => item.status === 'compliant').length,
    warning: historyItems.filter(item => item.status === 'warning').length,
    nonCompliant: historyItems.filter(item => item.status === 'non-compliant').length,
    avgScore: Math.round(historyItems.reduce((sum, item) => sum + item.score, 0) / historyItems.length)
  };

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
              <h1 className="text-2xl font-bold">Analysis History</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by title, institution, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border-border/50"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {['all', 'compliant', 'warning', 'non-compliant'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter as any)}
                  className="whitespace-nowrap"
                >
                  {filter === 'all' ? 'All' : 
                   filter === 'compliant' ? 'Compliant' :
                   filter === 'warning' ? 'Warning' : 'Non-Compliant'}
                </Button>
              ))}
              
              <div className="w-px h-6 bg-border mx-2" />
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Sort: {sortBy === 'date' ? 'Date' : sortBy === 'score' ? 'Score' : 'Name'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <motion.div
            className="p-4 bg-card rounded-xl shadow-lg border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            className="p-4 bg-card rounded-xl shadow-lg border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
                <p className="text-sm text-muted-foreground">Compliant</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            className="p-4 bg-card rounded-xl shadow-lg border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            className="p-4 bg-card rounded-xl shadow-lg border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.avgScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* History List */}
      <div className="px-6 pb-6">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl shadow-lg border border-border/50 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-primary/10 rounded-lg">
                          {getTypeIcon(item.type)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.institution}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date} at {item.time}</span>
                        </div>
                        {item.amount && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{item.amount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {item.score}%
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(item.score / 20)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        className={`text-xs ${
                          tag.includes('Haram') || tag.includes('Non-compliant')
                            ? 'border-red-200 text-red-600 bg-red-50'
                            : tag.includes('Halal')
                            ? 'border-green-200 text-green-600 bg-green-50'
                            : 'border-blue-200 text-blue-600 bg-blue-50'
                        }`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Button variant="ghost" size="sm" className="text-primary">
                      View Details
                    </Button>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryScreen;