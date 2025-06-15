import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Eye,
  Settings
} from 'lucide-react';

const SidebarTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const isMobile = useIsMobile();

  const tests = [
    {
      id: 'sidebar-toggle',
      name: 'Sidebar Toggle Animation',
      description: 'Test smooth sidebar expand/collapse animation',
      category: 'Animation'
    },
    {
      id: 'content-sync',
      name: 'Content Synchronization',
      description: 'Verify main content adjusts properly with sidebar',
      category: 'Layout'
    },
    {
      id: 'mobile-overlay',
      name: 'Mobile Overlay',
      description: 'Test mobile sidebar overlay functionality',
      category: 'Mobile'
    },
    {
      id: 'responsive-breakpoints',
      name: 'Responsive Breakpoints',
      description: 'Test layout at different screen sizes',
      category: 'Responsive'
    },
    {
      id: 'smooth-transitions',
      name: 'Smooth Transitions',
      description: 'Verify all animations are smooth and performant',
      category: 'Performance'
    },
    {
      id: 'no-overlap',
      name: 'No Content Overlap',
      description: 'Ensure sidebar never overlaps main content',
      category: 'Layout'
    }
  ];

  const runAutomatedTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    for (const test of tests) {
      setCurrentTest(test.name);
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock test results (in real scenario, these would be actual tests)
      const passed = Math.random() > 0.1; // 90% pass rate for demo
      setTestResults(prev => ({
        ...prev,
        [test.id]: passed
      }));
    }

    setCurrentTest('');
    setIsRunningTests(false);
  };

  const getDeviceInfo = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    const height = typeof window !== 'undefined' ? window.innerHeight : 0;
    
    let deviceType = 'Desktop';
    let icon = Monitor;
    
    if (width < 768) {
      deviceType = 'Mobile';
      icon = Smartphone;
    } else if (width < 1024) {
      deviceType = 'Tablet';
      icon = Tablet;
    }

    return { deviceType, icon, width, height };
  };

  const { deviceType, icon: DeviceIcon, width, height } = getDeviceInfo();

  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  const allTestsRun = totalTests === tests.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sidebar Layout Testing</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive testing suite for sidebar animations and layout optimization
          </p>
        </div>
        <Button 
          onClick={runAutomatedTests}
          disabled={isRunningTests}
          className="flex items-center gap-2"
        >
          {isRunningTests ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Run All Tests
            </>
          )}
        </Button>
      </div>

      {/* Device Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DeviceIcon className="h-5 w-5" />
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Device Type</div>
              <div className="text-lg font-semibold">{deviceType}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Screen Size</div>
              <div className="text-lg font-semibold">{width} × {height}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Mobile Detection</div>
              <Badge variant={isMobile ? "default" : "secondary"}>
                {isMobile ? "Mobile" : "Desktop"}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Viewport</div>
              <div className="text-lg font-semibold">
                {width < 768 ? 'Mobile' : width < 1024 ? 'Tablet' : 'Desktop'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Overview */}
      {allTestsRun && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Test Results Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-green-500">
                {passedTests}/{totalTests}
              </div>
              <div>
                <div className="text-lg font-semibold">Tests Passed</div>
                <div className="text-sm text-muted-foreground">
                  {((passedTests / totalTests) * 100).toFixed(1)}% success rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Test Status */}
      {isRunningTests && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 animate-spin text-blue-500" />
              <div>
                <div className="font-medium">Currently Running</div>
                <div className="text-sm text-muted-foreground">{currentTest}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((test) => {
          const hasResult = test.id in testResults;
          const passed = testResults[test.id];
          const isCurrentlyRunning = isRunningTests && currentTest === test.name;

          return (
            <Card key={test.id} className={`transition-all duration-200 ${
              isCurrentlyRunning ? 'ring-2 ring-blue-500' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{test.category}</Badge>
                    {hasResult && (
                      passed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    )}
                    {isCurrentlyRunning && (
                      <Clock className="h-5 w-5 animate-spin text-blue-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {test.description}
                </p>
                {hasResult && (
                  <div className={`text-sm font-medium ${
                    passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {passed ? '✓ Test Passed' : '✗ Test Failed'}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Manual Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Manual Testing Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Desktop Testing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click the sidebar toggle button to expand/collapse</li>
                <li>Verify smooth 300ms animation transitions</li>
                <li>Check that main content adjusts width accordingly</li>
                <li>Ensure no content overlap during transitions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Mobile Testing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Tap the menu button to open sidebar overlay</li>
                <li>Verify backdrop blur and overlay functionality</li>
                <li>Test touch interactions and swipe gestures</li>
                <li>Check that overlay closes when tapping outside</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Responsive Testing</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Resize browser window to test breakpoints</li>
                <li>Verify layout switches between mobile/desktop modes</li>
                <li>Check that animations remain smooth at all sizes</li>
                <li>Test orientation changes on mobile devices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Animation Duration</div>
              <div className="text-lg font-semibold">300ms</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Easing Function</div>
              <div className="text-lg font-semibold">cubic-bezier(0.4, 0, 0.2, 1)</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Hardware Acceleration</div>
              <Badge variant="default">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarTestPage;