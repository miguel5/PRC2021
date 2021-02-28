import json
from string import Template

alunos = json.load(open('alunos.json'))
docentes = json.load(open('docs.json'))
ucs = json.load(open('ucs.json'))


#with open('uc_template.txt', 'r') as f:
#    src = Template(f.read())
#    result = src.substitute(uc_dict)
#    print(result)





# Inferencia ucs
for uc in ucs:
    for doc in docentes:
        if(uc['id'] == doc['leciona']):
            uc['docente'] = [doc['id']]

    frequentadaPor = []
    for aluno in alunos:
        if(uc['id'] in aluno['frequenta']):
            frequentadaPor.append(aluno['id'])
    uc['alunos'] = frequentadaPor

# Inferencia docentes
for doc in docentes:
    ensinaA = []
    for aluno in alunos:
        if(doc['leciona'] in aluno['frequenta']):
            ensinaA.append(aluno['id'])
    doc['eProfessorDe'] = ensinaA


# Inferencia alunos
for aluno in alunos:
    eAlunoDe = []
    for doc in docentes:
        if(doc['leciona'] in aluno['frequenta']):
            eAlunoDe.append(doc['id'])
    aluno['eLecionadoPor'] = eAlunoDe


#### Write file ####

file = open('converted.ttl', 'w')

# Write ucs to file
for uc in ucs:
    uc_dict = {
        'designacao': 'Processamento e Representação de Conhecimento',
        'alunos': ',\n\t\t\t  :'.join(uc['alunos']),
        'docentes': ',\n\t\t       :'.join(uc['docente'])
    }
    
    with open('uc_template.txt', 'r') as f:
        src = Template(f.read())
        result = src.substitute(uc_dict)
        file.write(result + '\n\n')

# Write docentes to file
for doc in docentes:
    docs_dict = {
        'id': doc['id'],
        'uc': doc['leciona'],
        'alunos': ',\n\t\t   :'.join(doc['eProfessorDe']),
        'nome': doc['nome']
    }

    with open('docs_template.txt', 'r') as f:
        src = Template(f.read())
        result = src.substitute(docs_dict)
        file.write(result + '\n\n')

# Write alunos to file
for aluno in alunos:
    aluno_dict = {
        'id': aluno['id'],
        'ucs': ',\n\t\t      :'.join(aluno['frequenta']),
        'professores': ',\n\t\t     :'.join(aluno['eLecionadoPor']),
        'nome': aluno['nome']
    }

    with open('aluno_template.txt', 'r') as f:
        src = Template(f.read())
        result = src.substitute(aluno_dict)
        file.write(result + '\n\n')