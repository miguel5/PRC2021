import xml.etree.ElementTree as ET
from string import Template

tree = ET.parse('jcrpubs.xml')
root = tree.getroot()

authors = {}
pubs = {}

for entry in root:
    entryType = entry.tag
    pubs[entry.attrib.get('id')] = {}
    for child in entry:
        if authorid := child.get("authorid"):
            if(child.get("authorid") in authors):
                authors[authorid]['pubs'].append(entry.attrib)
            else:
                authors[authorid] = {'pubs': [entry.attrib]}

        pubs[entry.attrib.get('id')][child.tag] = child.text # change to allow multiple authors/referencedAuthors/editors
            

with open('converted.ttl', 'w'):
    # write pubs and auths

print(pubs)
            

