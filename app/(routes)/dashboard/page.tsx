import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
import { redirect } from 'next/navigation';
import RedirectButton from '@/components/ui/custom/redirect-button';

export default async function ProductsPage(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const { products, newOffset, totalProducts } = {
    products: [
      {
        name: 'Recogna',
        id: 0,
        status: 'ativo',
        imageUrl: 'https://www.fc.unesp.br/Home/Pesquisa/CPP/recogna.jpg',
        price: 77.9,
        stock: 12,
        availableAt: new Date(),
        description: 'Biometric & Pattern Recognition Research Group',
        people: [
          {
            profilePic:
              'https://media.licdn.com/dms/image/v2/C4D03AQG7X8IrRQITng/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517020830148?e=1748476800&v=beta&t=tgAJkHgkcEb0nBtFret-6-vK7AzXRB_3cT4S0Sj2X6o',
            name: 'João Paulo Papa'
          },
          {
            profilePic:
              'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=Vua4gxcAAAAJ&citpid=4',
            name: 'Aparecido Nilceu Marana'
          }
        ]
      },
      {
        name: 'LARS',
        id: 2,
        status: 'ativo',
        imageUrl: 'https://www.fc.unesp.br/Home/Pesquisa/CPP/lars.jpg',
        price: 77.9,
        stock: 12,
        availableAt: new Date(),
        description: 'Laboratório Avançado de Redes e Segurança',
        people: [
          {
            profilePic:
              'https://cdn.adscientificindex.com/pictures/f2/883709.jpg',
            name: 'Kelton Augusto'
          }
        ]
      },
      {
        name: 'CPOL/LAB',
        id: 1,
        status: 'ativo',
        imageUrl: 'https://i.ibb.co/27d6xV4r/CPOL-LAB-png-B002.png',
        price: 77.9,
        stock: 12,
        availableAt: new Date(),
        description:
          'Laboratório de Pesquisa em Teorias Constitucionais e Políticas',
        people: [
          {
            profilePic:
              'https://s1.static.brasilescola.uol.com.br/img/2019/10/michel-foucault.jpg',
            name: 'Michel Foucault'
          },
          {
            profilePic:
              'https://images.newscientist.com/wp-content/gallery/dn21599-chomsky/00541afae30.jpg',
            name: 'Noam Chomsky'
          },
          {
            profilePic:
              'https://i.pinimg.com/564x/cd/0a/a1/cd0aa1c0ba83091a8aacf70609f8ce43.jpg',
            name: 'Jean Sartre'
          },
          {
            profilePic:
              'https://hips.hearstapps.com/hmg-prod/images/simone-de-beauvoir-9269063-1-402.jpg',
            name: 'Simone de Beauvoir'
          }
        ]
      }
    ],
    newOffset: 0,
    totalProducts: 3
  };

  return (
    <Tabs defaultValue="all">
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
          <RedirectButton route={'/dashboard/register-research-environment'}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Novo Ambiente de Pesquisa
            </span>
          </RedirectButton>
        </div>
      </div>
      <TabsContent value="all">
        <ProductsTable
          products={products}
          offset={newOffset ?? 0}
          totalProducts={totalProducts}
        />
      </TabsContent>
    </Tabs>
  );
}
