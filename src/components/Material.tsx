import React, {ReactNode, useState} from 'react'
import MaterialItem from "./Material/MaterialItem";

const materials = [
    {
        id: 1,
        title: 'Цинкована Сталь',
        description: '(для торгівельних центрів та офісних приміщень)',
        imagePath: '/images/material/material1.png',
        list: [
            'Економічний варіант',
            'Відстань між рейками 17/69/121мм',
            'Гарантія на покриття 3 роки',
            'Термін виробництва до 10 роб. днів'
        ]
    },
    {
        id: 2,
        title: 'Алюміній',
        description: '(для домашнього інтер’єру, басейнів та ресторанів)',
        imagePath: '/images/material/material2.png',
        list: [
            'Надійне кріплення на несучому профілі',
            'Відстань між рейками кратний 10мм',
            'Гарантія на покриття 15 роки',
            'Термін виробництва до 4 тижнів',
            'Вологостійкий'
        ]
    },
    {
        id: 3,
        title: 'Акустична Повсть',
        description: '(для ефективного навчання та комфортного спілкування)',
        imagePath: '/images/material/material3.png',
        list: [
            'Гіпоалергенний',
            'Звукопоглинання та шумоізоляція',
            'Відстань між рейками 17/69/121мм',
            'Гарантія на покриття 10 років',
            'Термін виробництва до 6 тижнів'
        ]
    },
]

function Material() {

    const [activeMaterial, setActiveMaterial] = useState(1)

    return (
        <div className="Material">
            { materials.map(element => (
                <MaterialItem handleClick={() => setActiveMaterial(element.id)} {...element} active={element.id === activeMaterial} image={<img src={element.imagePath} alt={"#"} />} />
            ))}
        </div>
    )

}

export default Material