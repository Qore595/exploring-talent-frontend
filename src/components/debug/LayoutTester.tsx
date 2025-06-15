import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const LayoutTester: React.FC = () => {
  const [testContent, setTestContent] = useState('normal');
  const isMobile = useIsMobile();

  const generateLongContent = () => {
    return Array.from({ length: 50 }, (_, i) => (
      <div key={i} className="p-4 border rounded mb-2">
        <h3 className="font-semibold">Test Content Block {i + 1}</h3>
        <p className="text-muted-foreground">
          This is a test content block to verify that the layout handles long content properly 
          without causing horizontal overflow or layout shifts. The sidebar should remain 
          properly positioned and the main content should scroll vertically as expected.
        </p>
      </div>
    ));
  };

  const generateWideContent = () => {
    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {Array.from({ length: 10 }, (_, i) => (
                  <th key={i} className="border border-gray-300 px-4 py-2 bg-gray-100">
                    Column {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 10 }, (_, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 px-4 py-2">
                      Row {rowIndex + 1}, Col {colIndex + 1}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Layout Testing Component</CardTitle>
          <div className="flex gap-2">
            <Badge variant={isMobile ? "default" : "secondary"}>
              {isMobile ? "Mobile" : "Desktop"}
            </Badge>
            <Badge variant="outline">
              Screen: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => setTestContent('normal')}
                variant={testContent === 'normal' ? 'default' : 'outline'}
              >
                Normal Content
              </Button>
              <Button 
                onClick={() => setTestContent('long')}
                variant={testContent === 'long' ? 'default' : 'outline'}
              >
                Long Content
              </Button>
              <Button 
                onClick={() => setTestContent('wide')}
                variant={testContent === 'wide' ? 'default' : 'outline'}
              >
                Wide Content
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p><strong>Test Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Toggle sidebar open/closed to verify no content overlap</li>
                <li>Resize browser window to test responsive breakpoints</li>
                <li>Test on mobile devices for overlay behavior</li>
                <li>Scroll content to verify proper overflow handling</li>
                <li>Check that wide content doesn't break layout</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {testContent === 'normal' && (
          <Card>
            <CardHeader>
              <CardTitle>Normal Content Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>This is normal content that should display properly with the sidebar layout.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">Card {i + 1}</h4>
                        <p className="text-sm text-muted-foreground">Sample card content</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {testContent === 'long' && (
          <Card>
            <CardHeader>
              <CardTitle>Long Content Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {generateLongContent()}
              </div>
            </CardContent>
          </Card>
        )}

        {testContent === 'wide' && (
          <Card>
            <CardHeader>
              <CardTitle>Wide Content Test</CardTitle>
            </CardHeader>
            <CardContent>
              {generateWideContent()}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Layout Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Current State</h4>
              <ul className="space-y-1">
                <li>Device Type: {isMobile ? 'Mobile' : 'Desktop'}</li>
                <li>Viewport Width: {typeof window !== 'undefined' ? window.innerWidth : 'Unknown'}px</li>
                <li>Content Type: {testContent}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Expected Behavior</h4>
              <ul className="space-y-1">
                <li>✓ No horizontal overflow</li>
                <li>✓ Sidebar doesn't overlap content</li>
                <li>✓ Smooth transitions</li>
                <li>✓ Proper mobile overlay</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayoutTester;