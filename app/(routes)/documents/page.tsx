import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { researchEnvironments } from 'app/api/seed/mocks';
import { Download, Upload } from 'lucide-react';

// Mock documents data
const mockDocuments = [
  {
    id: 1,
    name: 'Metodologia da Pesquisa.pdf',
    uploadedBy: 'João Silva',
    uploadedAt: '2024-03-20'
  },
  {
    id: 2,
    name: 'Referencial Teórico.docx',
    uploadedBy: 'Maria Santos',
    uploadedAt: '2024-03-19'
  },
  {
    id: 3,
    name: 'Análise de Dados.xlsx',
    uploadedBy: 'Pedro Oliveira',
    uploadedAt: '2024-03-18'
  }
];

export default function page() {
  return (
    <Tabs>
      <div className="flex items-center mt-2">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Arquivados
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          {/* <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button> */}
        </div>
      </div>
      <TabsContent value="all">
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
                    <TableCell>
                      {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                    </TableCell>
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
        <div className="grid grid-cols-3 content-start mt-5">
          {researchEnvironments.map((env: any) => (
            <a
              className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              href="#"
              key={env.id}
            >
              <img
                className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                src={env.imageUrl}
                alt=""
              />
              <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {env.name}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {env.description}
                </p>
                {/* <UsersList
                  usersList={env.people.map((p: any) => ({
                    name: p.name,
                    profilePic: p.profilePic
                  }))}
                /> */}
              </div>
            </a>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
