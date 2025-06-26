'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Download, FolderOpenDot, Trash, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { getFilesByResearch, uploadFile } from 'services/file';
import { AxiosResponse } from 'axios';
import api from 'services/base/api';
import { IFileList } from 'types/file';

const mockDocuments: any = [];

interface IProps {
  researchId: string;
}

export function DocumentsTab({ researchId }: IProps) {
  const session = useSession();
  const [files, setFiles] = useState<IFileList[]>([]);
  const [file, setFile] = useState<File | undefined>();

  const getAllFiles = async () => {
    getFilesByResearch(researchId).then((r: AxiosResponse) => {
      setFiles(
        r.data.files.map(
          (item: any): IFileList => ({
            createdAt: new Date(item.createdAt),
            id: item.fileId,
            name: item.fileName,
            url: item.fileUrl,
            userName: item.user.name
          })
        )
      );
    });
  };

  useEffect(() => {
    if (api.defaults.headers.Authorization) getAllFiles();
  }, [session]);

  useEffect(() => {
    if (file)
      uploadFile(researchId, file).then((r: AxiosResponse) => {
        console.log('r');
        console.log(r);
        getAllFiles();
      });
  }, [file]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Documentos</CardTitle>
          <Button
            onClick={() => {
              document.getElementById('fileInput')?.click();
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Documento
            <input
              className="hidden"
              id="fileInput"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) setFile(e.target.files[0]);
              }}
              type="file"
            />
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
            {files.length === 0 ? (
              <TableRow>
                <td
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-lg font-medium">
                      Nenhum dado encontrado
                    </div>
                    <div className="text-sm">
                      Não há documentos para exibir no momento.
                    </div>
                  </div>
                </td>
              </TableRow>
            ) : (
              files.map((doc: IFileList) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.userName}</TableCell>
                  <TableCell>
                    {doc.createdAt.toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      <FolderOpenDot className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4 text-red-700" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
