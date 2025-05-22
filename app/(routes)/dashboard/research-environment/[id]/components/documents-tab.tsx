"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Upload } from 'lucide-react';

// Mock documents data
const mockDocuments = [
  {
    id: 1,
    name: "Metodologia da Pesquisa.pdf",
    uploadedBy: "João Silva",
    uploadedAt: "2024-03-20"
  },
  {
    id: 2,
    name: "Referencial Teórico.docx",
    uploadedBy: "Maria Santos",
    uploadedAt: "2024-03-19"
  },
  {
    id: 3,
    name: "Análise de Dados.xlsx",
    uploadedBy: "Pedro Oliveira",
    uploadedAt: "2024-03-18"
  }
];

export function DocumentsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Documentos</CardTitle>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Documento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Documento</TableHead>
              <TableHead>Enviado por</TableHead>
              <TableHead>Data de Upload</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.uploadedBy}</TableCell>
                <TableCell>{new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 