'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Database, CheckCircle } from 'lucide-react';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Database seeded successfully!');
        setResult(data);
      } else {
        toast.error(data.error || 'Failed to seed database');
        setResult(data);
      }
    } catch (error: any) {
      console.error('Seed error:', error);
      toast.error('Failed to seed database');
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Database Seeder</h1>
        <p className="text-muted-foreground">
          Populate the database with sample food items for testing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>
            This will clear all existing food items and insert 17 sample food items across 6 categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSeed}
                disabled={loading}
                size="lg"
                className="w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-5 w-5" />
                    Seed Database
                  </>
                )}
              </Button>
            </div>

            {result && (
              <Card className={result.success ? 'border-green-500' : 'border-red-500'}>
                <CardContent className="pt-6">
                  {result.success ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Success!</span>
                      </div>
                      <p>{result.message}</p>
                      <p className="text-sm text-muted-foreground">
                        Inserted {result.count} food items
                      </p>
                      {result.foods && (
                        <div className="mt-4">
                          <p className="font-semibold mb-2">Food items added:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {result.foods.map((name: string, index: number) => (
                              <li key={index}>{name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-600">
                        <span className="font-semibold">Error</span>
                      </div>
                      <p className="text-sm">{result.error}</p>
                      {result.details && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Details: {result.details}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Sample Categories:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                <div>• Pizza (3 items)</div>
                <div>• Burgers (3 items)</div>
                <div>• Pasta (3 items)</div>
                <div>• Sushi (3 items)</div>
                <div>• Salads (2 items)</div>
                <div>• Desserts (2 items)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Alternative: Use cURL</CardTitle>
          <CardDescription>
            You can also seed the database using a POST request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>curl -X POST http://localhost:3000/api/seed</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
