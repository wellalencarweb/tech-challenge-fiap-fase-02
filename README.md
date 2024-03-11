# tech-challenge-fiap
Sistema de Gerenciamento de Pedidos - Fast Food

##  Grupo 33
[Wellington da Silva Alencar](https://github.com/wellalencarweb) | rm353081

[Link do Projeto](https://github.com/wellalencarweb/tech-challenge-fiap)

[Link do Event Storm](https://miro.com/app/board/uXjVNVCMJaU=/?share_link_id=723408841855)

[Link da Documentação da API](https://documenter.getpostman.com/view/2196561/2s9YysBgBA)

[Dockerfile](Dockerfile)

[docker-compose](docker-compose.yml)

## Fase 2 - Kubernetes

# Arquitetura Kubernetes
Os arquivos necessários se encontram na pasta /k8s. A arquitetura do cluster Kubernetes segue o diagrama a seguir:

![Arquitetura Kubernetes](https://i.imgur.com/beqs6FJ.png)

Nesse modelo, o banco de dados é ilustrado como um elemento apartado, podendo ser acoplado individualmente (através de uma entidade isolada), mas há dentro do repositório uma estrutura em Pod com uma imagem do banco de dados. Dessa forma, há diversas combinações possíveis a serem executadas com os arquivos da pasta /k8s, as explicações encontram-se a seguir.

## Ordem de execução dos comandos
Os elementos precisam ser criados na ordem estabelecida a seguir, mas antes disso recomenda-se ler todo este documento para entender todas as opções possíveis de execução.



minikube start
cd k8s
* kubectl apply -f secret-opaque.yaml
  ---- BD ----
* kubectl apply -f mongodb-pod.yaml
* kubectl apply -f mongodb-service.yaml
  ** carga opcional: kubectl apply -f import-job.yaml
  --- APP LOad Balance
  kubectl apply -f app-deployment.yaml
  kubectl apply -f load-balancer-service.yaml

minikube service app-load-balancer --url
/api-docs

http://ip-load-balancer:port-load-balancer/api-docs


1) Arquivo secrets
   `kubectl apply -f secret-opaque.yaml`
2) Iniciar o banco de dados (ver antes as opções abaixo)
3) Deployment da Aplicação
   `kubectl apply -f app-deployment.yaml`
4) Load Balancer
   `kubectl apply -f load-balancer-service.yaml`

## Opção 1: Usando um banco Mongo "externo"
Nesse caso é preciso editar o arquivo secret-opaque.yaml, editando a string de conexão do banco "MONGODB_CONN_STRING", demais variáveis não são necessárias. (Lembrando que nesse caso deve ser passado um endereço que não seja o localhost).

## Opção 2: Usando o Pod do repositório
A string de conexão que está no _secret-opaque.yaml_ é que a contém o serviço do Mongo em um Pod. Para usar o Pod contendo o banco, há duas opções possíveis

### 2.1 Sem Volume Persistido (mais simples)
Nesse caso só é necessário subir o Pod do Mongo e o Service.

`kubectl apply -f mongodb-pod.yaml`


`kubectl apply -f mongodb-service.yaml`

O service do banco está configurado como um NodePort para ser acessível via algum client externo (Compass, Studio 3T, etc).


### 2.1 Com Volume Persistido
Nesse caso é preciso editar o arquivo _pv.yaml_, passando o caminho da máquina no _hostPath_. Depois é preciso executar os arquivos nessa ordem:

`kubectl apply -f pv.yaml`

`kubectl apply -f pvc.yaml`

`kubectl apply -f mongodb-pod-pvc.yaml`

`kubectl apply -f mongodb-service.yaml`


## App e Load Balancer
Depois de subir o banco, executar o deployment do App e do Load Balancer

`kubectl apply -f app-deployment.yaml`

`kubectl apply -f load-balancer-service.yaml`

O deployment está com 2 replicas (opcionalmente podendo ser escalável via HPA, explicação a seguir), e o Load Balancer está configurado para subir na porta 80, para ver o endereço de execução, rodar o comando:

`kubectl describe services app-load-balancer`

O host está na opção `LoadBalancer Ingress`

## (Opcional) Escalando com HPA
No repositório há também arquivos para configurar o HPA, para isso é necessário subir o metrics e o hpa
`kubectl apply -f metrics.yaml`

`kubectl apply -f hpa.yaml`

Dentro da pasta /k8s também há um script simples do K6 para testar o HPA.


## Como rodar o projeto (Fase 1 - Docker)

Fazer o clone e ir na pasta do projeto (por exemplo: fiap-soat1-tech-challenge)

```shell
cd fiap-soat1-tech-challenge
```

Subir os contâineres do MongoDB e do Node usando o arquivo docker-compose.yml:

```shell
docker compose -f docker-compose.yml up -d
```

Verificar se subiram os containeres fastFoodMongodb e fastFoodApi:

```shell
docker ps
```

## Documentação das API's

Em qualquer navegador acessar a url:

```shell
http://localhost:6001/api-docs
```

## Chamando as API's

Em uma ferramenta como POSTMAN ou INSOMNIA executar por exemplo (também é possível testar no swagger):

```shell
http://localhost:6001/api/produtos/lanche
```

> Retorna os produtos na categoria lanche
