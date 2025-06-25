# Hooks Personalizados

## useCurrentUser

Hook personalizado para buscar as informações do usuário logado no sistema usando TanStack Query.

### Uso Básico

```tsx
import { useCurrentUser } from '../hooks/useCurrentUser';

function MyComponent() {
  const { 
    data: currentUser, 
    isLoading, 
    error, 
    refetch 
  } = useCurrentUser();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!currentUser) return <div>Nenhum usuário logado</div>;

  return (
    <div>
      <h1>Olá, {currentUser.name}!</h1>
      <p>Email: {currentUser.email}</p>
    </div>
  );
}
```

### Retorno do Hook

O hook retorna um objeto com as seguintes propriedades:

- `data`: Dados do usuário logado (tipo `IUser`)
- `isLoading`: Boolean indicando se está carregando
- `error`: Erro da requisição (se houver)
- `refetch`: Função para refazer a requisição
- `isFetching`: Boolean indicando se está fazendo fetch
- `isSuccess`: Boolean indicando se a requisição foi bem-sucedida

### Configurações

O hook está configurado com:

- **staleTime**: 5 minutos (dados considerados frescos por 5 min)
- **gcTime**: 10 minutos (dados mantidos em cache por 10 min)
- **retry**: 1 tentativa em caso de erro
- **refetchOnWindowFocus**: false (não refaz requisição ao focar na janela)

### Tipos

O hook retorna dados do tipo `IUser`:

```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  mutualResearches?: IResearch[];
  createdAt?: Date;
  formation?: IDegree[];
}
```

### Exemplo Completo

Veja o arquivo `components/examples/CurrentUserExample.tsx` para um exemplo completo de uso. 