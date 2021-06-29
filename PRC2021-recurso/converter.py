import json

movies = json.load(open('C:\\Users\\Miguel\\Documents\\MIEI\\2021\\PRC\\PRC2021\\PRC2021-recurso\\movies.json', encoding="utf8"))

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
                s = '\n###  http://www.semanticweb.org/miguel/ontologies/2021/5/recurso#ator' + str(ator_id)
                s = s + '\n       :ator' + str(ator_id) + ' rdf:type owl:NamedIndividual ;'
                s = s + '\n       :nome "' + ator.replace('"', "'") + '"^^xsd:string .'

                f.write(s)

        for genero in movie['genres']:
            if genero not in generos:
                generos.append(genero)

                s = ''
                s = '\n###  http://www.semanticweb.org/miguel/ontologies/2021/5/recurso#' + genero.replace(' ', '_')
                s = s + '\n       :' + genero.replace(' ', '_') + ' rdf:type owl:NamedIndividual ,'
                s = s + '\n       :Género .'

                f.write(s)

        s = ''
        s = '\n###  http://www.semanticweb.org/miguel/ontologies/2021/5/recurso#filme' + str(filme_id)
        s = s + '\n       :filme' + str(filme_id) + ' rdf:type owl:NamedIndividual ,'
        s = s + '\n       :Filme ;'
        s = s + '\n       '
        #s = s + '\n:temAtor :ator' + f" ,\n:ator{movie['cast'].index()}".join(movie['cast'])
        if len(movie['cast']) != 0:
            s = s + '\n       :temAtor '
            for ator in movie['cast'][:-1]:
                s = s + '     :ator' + str(atores.index(ator)) + ',\n'
            s = s + '     :ator' + str(atores.index(movie['cast'][-1])) + ';\n'

        if len(movie['genres']) != 0:
            s = s + '\n       :temGenero '
            for genero in movie['genres'][:-1]:
                s = s + '     :' + genero.replace(' ', '_') + ',\n'
            s = s + '     :' + genero.replace(' ', '_') + ';\n'
        s = s + '\n       :title "' + movie['title'].replace('"', "'") + '" ;'
        s = s + '\n       :year "' + str(movie['year']) + '"^^xsd:int .'

        f.write(s)

        filme_id = filme_id + 1