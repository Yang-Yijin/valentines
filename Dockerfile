FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Valentine.csproj ./
RUN dotnet restore Valentine.csproj

COPY . ./
RUN dotnet publish Valentine.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish ./
COPY --from=build /src/frontend ./frontend/

ENTRYPOINT ["dotnet", "Valentine.dll"]
