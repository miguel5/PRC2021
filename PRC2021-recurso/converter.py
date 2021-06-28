import json

movies = json.load(open('C:\\Users\\Miguel\\Documents\\MIEI\\2021\\PRC\\PRC2021-recurso\\movies.json'))

atores = []
generos = []
filme_id = 0

with open('individuos.ttl', 'a', encoding='utf-8') as f:

    for movie in movies:
        for ator in movie['cast']:
            if ator not in atores:
                atores.append(ator)
            
                ator_id = atores.index(ator)

                s = ''
                s = '###  http://www.semanticweb.org/miguel/ontologies/2021/5/recurso#ator' + ator_id
                s = s + '       :ator' + ator_id + ' rdf:type owl:NamedIndividual ;'
                s = s + '       :nome "' + ator + '"^^xsd:string .'

                f.write(s)

        for genero in movie['genres']:
            if genero not in generos:
                atores.append(ator)
            
                genero_id = generos.index(genero)

                s = ''
                s = '###  http://www.semanticweb.org/miguel/ontologies/2021/5/recurso#' + genero
                s = s + '       :' + genero + ' rdf:type owl:NamedIndividual ,'
                s = s + '       :Género .'

                f.write(s)

        s = ''
        s = '###  http://www.semanticweb.org/miguel/ontologies/2021/5/recurso#filme' + str(filme_id)
        s = s + '       :' + str(filme_id) + ' rdf:type owl:NamedIndividual ,'
        s = s + '       :Filme ;'
        s = s + '       '
        s = s + ':temAtor :ator' + f" ,\n:ator".join(movie['cast'])
        s = s + '       :title "' + movie['title'] + '" ;'
        s = s + '       :year "' + movie['year'] + '"^^xsd:int .'


        

        
