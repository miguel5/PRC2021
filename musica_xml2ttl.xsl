<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="w3.org/1999/XSL/Transform"

  xmlns:xd="oxygenxml.com/ns/doc/xsl"

  exclude-result-prefixes="xd"

  version="1.0">

  <xd:doc scope="stylesheet">

    <xd:desc>

      <xd:p><xd:b>Created on:</xd:b> Mar 1, 2021</xd:p>

      <xd:p><xd:b>Author:</xd:b> jcr</xd:p>

      <xd:p>Conversão das obras musicais de XML para TTL</xd:p>

    </xd:desc>

  </xd:doc>

  

  <xsl:output method="text" encoding="UTF-8" indent="yes"/>


  <xsl:template match = "/">
        <xsl:apply-templates select="/" mode="obras"/>
        <xsl:apply-templates select="//instrumentos" mode="insts"/>
        <xsl:apply-templates select="//partitura" mode="inst_par"/>
    </xsl:template>

    <xsl:template match="obra" mode="obras">
        ###  http://www.di.uminho.pt/prc2021/musica#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Obra ;
        <xsl:apply-templates mode="list" select="instrumentos"/>
        :título "<xsl:value-of select="titulo"/>" ;
        :subtitulo "<xsl:value-of select="subtitulo"/>" ;
        :tipo "<xsl:value-of select="tipo"/>" ;
        :compostaPor "<xsl:value-of select="compositor"/>" ;
        :arranjo "<xsl:value-of select="arranjo"/>" ;
        :video "<xsl:value-of select="inf-relacionada/video/@href"/>" .
        # ----------------------------------------
    </xsl:template>

    <xsl:template match="instrumento" mode="list">:temInstrumento :i<xsl:value-of select="generate-id()"/> ;</xsl:template>

    <xsl:template match="instrumento" mode="insts">
        ###  http://www.di.uminho.pt/prc2021/musica#i<xsl:value-of select="generate-id()"/>
        :ins_<xsl:value-of select="generate-id()"/> rdf:type owl:NamedIndividual ,
        :Instrumento ;
        <xsl:apply-templates mode="parts" select="partitura"/>
        :designação "<xsl:value-of select="designacao"/>" .
        #-----------------------------------
    </xsl:template>

    <xsl:template match="partitura" mode="parts">:temPartitura :p<xsl:value-of select="generate-id()"/> ;</xsl:template>

    <xsl:template match="//partitura" mode="inst_par">
        ###  http://www.di.uminho.pt/prc2021/musica#p<xsl:value-of select="generate-id()"/>
        :p<xsl:value-of select="generate-id()"/> rdf:type owl:NamedIndividual ,
        :Partitura ;
        :path "<xsl:value-of select="@path"/>" ;
        :type "<xsl:value-of select="@type"/>" ;
        :clave "<xsl:value-of select="@clave"/>" ;
        :voz "<xsl:value-of select="@voz"/>" ;
        :afinação "<xsl:value-of select="@afinacao"/>" .
        # ----------------------------------
    </xsl:template>
  

</xsl:stylesheet>