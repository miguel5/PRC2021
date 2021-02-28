import json
import random

ucs = ['Processamento e Representação de Conhecimento', 'Scripting no Processamento de Linguagem Natural',
       'Algoritmos Paralelos', 'Engenharia de Sistemas de Computação']

ucs2 = ['PRC', 'SPLN', 'AP', 'ESC']


with open('nomesAlunos.json', 'r') as file:
    data = json.load(file)
    #print(json.dumps(data, indent=4, sort_keys=True))
    with open('dataset.json', 'w') as dataset:
        for aluno in data:
            n_ucs_frequentadas = random.randint(1, 4)
            #ucs_frequentadas = random.sample(range(1, 4), n_ucs_frequentadas)
            ucs_frequentadas = [ucs2[x-1] for x in random.sample(range(0, 4), n_ucs_frequentadas)]
            aluno['frequenta'] = ucs_frequentadas
            aluno['id'] = 'A' + str(random.randint(75000, 90000))

        json.dump(data, dataset, indent=4, sort_keys=True, ensure_ascii=False)