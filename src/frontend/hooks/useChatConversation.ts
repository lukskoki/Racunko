import { useState, useEffect } from 'react';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}
// Simulirani JSON razgovora da mozemo kasnije u backend implementirat
const conversations: Record<string, Message[]> = {
    '1': [
        {
            id: '1',
            text: 'Koliko sam potrošio ovaj mjesec?',
            isUser: true,
            timestamp: new Date('2025-12-15T10:00:00'),
        },
        {
            id: '2',
            text: `Prema vašim podacima, ovaj mjesec ste potrošili **1.245,50 €**.

Evo **detaljnog pregleda** po kategorijama:

- **Hrana i piće**: 450,00 €
- **Prijevoz**: 280,00 €
- **Zabava**: 215,50 €
- **Računi**: 300,00 €

To je **15% manje** od prošlog mjeseca! 🎉`,
            isUser: false,
            timestamp: new Date('2025-12-15T10:00:05'),
        },
        {
            id: '3',
            text: 'Imam li dovoljno novca za novi laptop?',
            isUser: true,
            timestamp: new Date('2025-12-15T10:01:00'),
        },
        {
            id: '4',
            text: `Na temelju vaših financija, evo **analize**:

**Trenutno stanje**:
- Tekući račun: 2.350,00 €
- Štednja: 1.800,00 €
- **Ukupno**: 4.150,00 €

**Preporuka**:
S obzirom na vašu prosječnu mjesečnu potrošnju od ~1.450 €, preporučujem:

1. **Da** - ako laptop košta manje od 1.000 €
2. **Ne** - ako košta više, jer bi to utjecalo na vaš **sigurnosni fond**

*Savjet*: Pokušajte uštedjeti još 2-3 mjeseca za veću kupnju.`,
            isUser: false,
            timestamp: new Date('2025-12-15T10:01:08'),
        },
    ],
    '2': [
        {
            id: '5',
            text: 'Koji su moji najveći troškovi?',
            isUser: true,
            timestamp: new Date('2025-12-14T14:00:00'),
        },
        {
            id: '6',
            text: `Analizirajući vaše troškove u zadnjih **6 mjeseci**, evo *top 5* kategorija:

### 1. Hrana i piće (35%)
- Prosječno: **450-500 €/mjesec**
- Restorani čine 60% ovog troška

### 2. Prijevoz (20%)
- Prosječno: **280 €/mjesec**
- Gorivo + održavanje vozila

### 3. Računi (18%)
- Prosječno: **250-300 €/mjesec**
- Struja, voda, internet

### 4. Zabava (15%)
- Prosječno: **200 €/mjesec**

### 5. Odjeća (12%)
- Prosječno: **150 €/mjesec**

> **Tip**: Smanjite troškove restorana za 20% i uštedit ćete ~270 € mjesečno!`,
            isUser: false,
            timestamp: new Date('2025-12-14T14:00:12'),
        },
    ],
    '3': [
        {
            id: '7',
            text: 'Kako mogu uštedjeti više?',
            isUser: true,
            timestamp: new Date('2025-12-13T09:30:00'),
        },
        {
            id: '8',
            text: `Odličan pristup! Evo **personaliziranih preporuka**:

## Brze uštede 💡

**1. Hrana iz restorana** → kuhanje kod kuće
- Potencijalna ušteda: **270 €/mjesec**

**2. Iskoristite javni prijevoz**
- Umjesto vozila 2-3 puta tjedno
- Potencijalna ušteda: **80 €/mjesec**

**3. Maknite nekorištene pretplate**
- Streaming servisi, članarine
- Potencijalna ušteda: **30-50 €/mjesec**

## Pravilo 50/30/20 📊

Za vaš prihod od **2.500 €**, preporučam:
- 50% (1.250 €) - *osnovne potrebe*
- 30% (750 €) - *želje*
- **20% (500 €)** - **štednja**

Trenutno štedite samo 8%. Povećajte na **15-20%**!`,
            isUser: false,
            timestamp: new Date('2025-12-13T09:30:15'),
        },
        {
            id: '9',
            text: 'Koji bi bio moj financijski cilj za iduću godinu?',
            isUser: true,
            timestamp: new Date('2025-12-13T09:31:00'),
        },
        {
            id: '10',
            text: `Na temelju vaših trenutnih prihoda i navika, predlažem **SMART ciljeve** za 2026:

### Glavni cilj: Uštedjeti 6.000 € 💰

**Kako to postići:**
1. Štedite **500 €/mjesec** (20% prihoda)
2. Smanjite troškove restorana na **150 €/mjesec**
3. Prenesite **100 €/mjesec** na štedni račun automatski

### Međuciljevi:
- ✅ **Q1 2026**: 1.500 € štednje
- ✅ **Q2 2026**: 3.000 € štednje
- ✅ **Q3 2026**: 4.500 € štednje
- ✅ **Q4 2026**: 6.000 € štednje

*To je dovoljan fond za hitne slučajeve i veće kupovine!* 🎯`,
            isUser: false,
            timestamp: new Date('2025-12-13T09:31:20'),
        },
    ],
};



// Hook za dohvacanje razgovora po ID-u
export const useChatConversation = (conversationId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ako nema ID-a, resetiraj sve
        if (!conversationId) {
            setMessages([]);
            setLoading(false);
            setError(null);
            return;
        }

        // Tu ce ic api poziv
        const conversation = conversations[conversationId];
        setMessages(conversation);
        
    }, [conversationId]);

    return { messages, loading, error };
};



