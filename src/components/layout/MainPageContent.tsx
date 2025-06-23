
import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import UploadArea from '@/components/UploadArea';
import ComplianceBanner from '@/components/ComplianceBanner';
import ContractTermsList from '@/components/ContractTermsList';

const MainPageContent: React.FC = () => {
    const { sessionId, analysisTerms } = useSession();
    const isContractAnalyzed = !!sessionId && !!Array.isArray(analysisTerms) && analysisTerms.length > 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <main className="flex-grow py-6 sm:py-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-subtle" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="relative container max-w-full sm:max-w-6xl mx-auto px-4 sm:px-6 h-full">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8 sm:space-y-10 h-full"
                >
                    {/* Upload Area */}
                    <motion.div 
                        variants={itemVariants}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm rounded-2xl -m-2" />
                        <div className="relative">
                            <UploadArea onAnalyzed={() => {}} />
                        </div>
                    </motion.div>

                    {/* Analysis Results */}
                    {isContractAnalyzed && (
                        <>
                            <motion.div 
                                variants={itemVariants}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm rounded-2xl -m-2" />
                                <div className="relative">
                                    <ComplianceBanner />
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                variants={itemVariants}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm rounded-2xl -m-2" />
                                <div className="relative">
                                    <ContractTermsList />
                                </div>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </div>
        </main>
    );
};

export default MainPageContent;
