'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, TrendingUp, BookOpen, Plus, Trash2, Calendar, Users, Trophy, ClipboardList } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

// Tipos
interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string[]
  description: string
  tips: string[]
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
}

interface MaxLoad {
  exerciseId: string
  exerciseName: string
  weight: number
  date: string
  userId: string
  userName: string
}

interface QuizData {
  name: string
  age: string
  weight: string
  height: string
  hasPracticed: string
  experienceLevel: string
  weeklyFrequency: string
  mainGoals: string
  otherGoal: string
  followsDiet: string
  dietType: string
  otherDiet: string
  hasLimitation: string
  limitation: string
  additionalGoals: string
}

// Base de dados de exercícios
const exercisesDatabase: Exercise[] = [
  // PEITO
  {
    id: 'bench-press',
    name: 'Supino Reto',
    muscleGroup: 'Peito',
    equipment: ['Barra', 'Banco reto', 'Suporte para barra'],
    description: 'Exercício fundamental para desenvolvimento do peitoral maior. Deite no banco, pegue a barra com pegada média e desça até o peito, depois empurre para cima.',
    tips: [
      'Mantenha os pés firmes no chão',
      'Escápulas retraídas durante todo movimento',
      'Desça a barra de forma controlada',
      'Não tire o quadril do banco'
    ],
    difficulty: 'Intermediário'
  },
  {
    id: 'incline-press',
    name: 'Supino Inclinado',
    muscleGroup: 'Peito',
    equipment: ['Barra', 'Banco inclinado 30-45°', 'Suporte para barra'],
    description: 'Foca na porção superior do peitoral. Ajuste o banco em 30-45° e execute o movimento similar ao supino reto.',
    tips: [
      'Inclinação ideal: 30-45 graus',
      'Foco na contração do peitoral superior',
      'Evite inclinar muito (vira ombro)'
    ],
    difficulty: 'Intermediário'
  },
  {
    id: 'chest-fly',
    name: 'Crucifixo com Halteres',
    muscleGroup: 'Peito',
    equipment: ['Halteres', 'Banco reto'],
    description: 'Exercício de isolamento para o peitoral. Abra os braços lateralmente e retorne à posição inicial.',
    tips: [
      'Cotovelos levemente flexionados',
      'Movimento amplo mas controlado',
      'Sinta o alongamento do peitoral'
    ],
    difficulty: 'Iniciante'
  },
  // COSTAS
  {
    id: 'deadlift',
    name: 'Levantamento Terra',
    muscleGroup: 'Costas',
    equipment: ['Barra', 'Anilhas'],
    description: 'Exercício composto que trabalha toda a cadeia posterior. Levante a barra do chão mantendo as costas retas.',
    tips: [
      'Coluna neutra SEMPRE',
      'Força vem das pernas e quadril',
      'Olhar para frente',
      'Barra próxima ao corpo'
    ],
    difficulty: 'Avançado'
  },
  {
    id: 'pull-up',
    name: 'Barra Fixa',
    muscleGroup: 'Costas',
    equipment: ['Barra fixa'],
    description: 'Exercício de peso corporal para dorsais. Puxe o corpo até o queixo passar a barra.',
    tips: [
      'Pegada pronada (palmas para frente)',
      'Escápulas deprimidas no início',
      'Puxe os cotovelos para baixo e trás'
    ],
    difficulty: 'Intermediário'
  },
  {
    id: 'seated-row',
    name: 'Remada Sentada',
    muscleGroup: 'Costas',
    equipment: ['Máquina de remada', 'Cabo'],
    description: 'Exercício para desenvolvimento da espessura das costas. Puxe o cabo em direção ao abdômen.',
    tips: [
      'Mantenha o tronco estável',
      'Puxe com os cotovelos, não com as mãos',
      'Contraia as escápulas no final'
    ],
    difficulty: 'Iniciante'
  },
  // PERNAS
  {
    id: 'squat',
    name: 'Agachamento Livre',
    muscleGroup: 'Pernas',
    equipment: ['Barra', 'Rack', 'Anilhas'],
    description: 'Rei dos exercícios para pernas. Desça com a barra nas costas até as coxas ficarem paralelas ao chão.',
    tips: [
      'Joelhos alinhados com os pés',
      'Desça até paralelo ou abaixo',
      'Peso nos calcanhares',
      'Core contraído'
    ],
    difficulty: 'Avançado'
  },
  {
    id: 'leg-press',
    name: 'Leg Press 45°',
    muscleGroup: 'Pernas',
    equipment: ['Máquina Leg Press'],
    description: 'Exercício para quadríceps e glúteos. Empurre a plataforma com os pés.',
    tips: [
      'Pés na largura dos ombros',
      'Não trave os joelhos no topo',
      'Desça até 90 graus ou mais'
    ],
    difficulty: 'Iniciante'
  },
  {
    id: 'leg-curl',
    name: 'Mesa Flexora',
    muscleGroup: 'Pernas',
    equipment: ['Máquina flexora'],
    description: 'Isolamento para posterior de coxa. Flexione as pernas trazendo os calcanhares em direção aos glúteos.',
    tips: [
      'Quadril colado no banco',
      'Movimento controlado',
      'Contraia no topo'
    ],
    difficulty: 'Iniciante'
  },
  // OMBROS
  {
    id: 'military-press',
    name: 'Desenvolvimento Militar',
    muscleGroup: 'Ombros',
    equipment: ['Barra', 'Banco com encosto'],
    description: 'Exercício principal para ombros. Empurre a barra acima da cabeça.',
    tips: [
      'Core contraído',
      'Não arquear as costas',
      'Barra sobe em linha reta'
    ],
    difficulty: 'Intermediário'
  },
  {
    id: 'lateral-raise',
    name: 'Elevação Lateral',
    muscleGroup: 'Ombros',
    equipment: ['Halteres'],
    description: 'Isolamento para deltóide lateral. Eleve os halteres lateralmente até a altura dos ombros.',
    tips: [
      'Cotovelos levemente flexionados',
      'Não usar impulso',
      'Controle na descida'
    ],
    difficulty: 'Iniciante'
  },
  // BRAÇOS
  {
    id: 'barbell-curl',
    name: 'Rosca Direta',
    muscleGroup: 'Bíceps',
    equipment: ['Barra', 'Anilhas'],
    description: 'Exercício clássico para bíceps. Flexione os cotovelos trazendo a barra em direção aos ombros.',
    tips: [
      'Cotovelos fixos ao lado do corpo',
      'Não balançar o corpo',
      'Controle total do movimento'
    ],
    difficulty: 'Iniciante'
  },
  {
    id: 'tricep-pushdown',
    name: 'Tríceps Pulley',
    muscleGroup: 'Tríceps',
    equipment: ['Polia alta', 'Barra reta ou corda'],
    description: 'Isolamento para tríceps. Empurre a barra/corda para baixo estendendo os cotovelos.',
    tips: [
      'Cotovelos colados ao corpo',
      'Extensão completa',
      'Controle na subida'
    ],
    difficulty: 'Iniciante'
  },
  {
    id: 'hammer-curl',
    name: 'Rosca Martelo',
    muscleGroup: 'Bíceps',
    equipment: ['Halteres'],
    description: 'Trabalha bíceps e antebraço. Flexione com pegada neutra (palmas frente a frente).',
    tips: [
      'Pegada neutra durante todo movimento',
      'Alterna ou simultâneo',
      'Foco no braquial'
    ],
    difficulty: 'Iniciante'
  }
]

// Dados simulados de outros usuários (em produção viria do banco de dados)
const mockUserLoads: MaxLoad[] = [
  { exerciseId: 'bench-press', exerciseName: 'Supino Reto', weight: 120, date: '2024-01-15', userId: 'user1', userName: 'Carlos Silva' },
  { exerciseId: 'bench-press', exerciseName: 'Supino Reto', weight: 100, date: '2024-01-14', userId: 'user2', userName: 'João Santos' },
  { exerciseId: 'bench-press', exerciseName: 'Supino Reto', weight: 95, date: '2024-01-13', userId: 'user3', userName: 'Pedro Costa' },
  { exerciseId: 'squat', exerciseName: 'Agachamento Livre', weight: 150, date: '2024-01-15', userId: 'user1', userName: 'Carlos Silva' },
  { exerciseId: 'squat', exerciseName: 'Agachamento Livre', weight: 140, date: '2024-01-14', userId: 'user4', userName: 'Lucas Oliveira' },
  { exerciseId: 'squat', exerciseName: 'Agachamento Livre', weight: 130, date: '2024-01-13', userId: 'user2', userName: 'João Santos' },
  { exerciseId: 'deadlift', exerciseName: 'Levantamento Terra', weight: 180, date: '2024-01-15', userId: 'user5', userName: 'Rafael Mendes' },
  { exerciseId: 'deadlift', exerciseName: 'Levantamento Terra', weight: 170, date: '2024-01-14', userId: 'user1', userName: 'Carlos Silva' },
  { exerciseId: 'deadlift', exerciseName: 'Levantamento Terra', weight: 160, date: '2024-01-13', userId: 'user4', userName: 'Lucas Oliveira' },
  { exerciseId: 'military-press', exerciseName: 'Desenvolvimento Militar', weight: 70, date: '2024-01-15', userId: 'user2', userName: 'João Santos' },
  { exerciseId: 'military-press', exerciseName: 'Desenvolvimento Militar', weight: 65, date: '2024-01-14', userId: 'user3', userName: 'Pedro Costa' },
  { exerciseId: 'pull-up', exerciseName: 'Barra Fixa', weight: 25, date: '2024-01-15', userId: 'user4', userName: 'Lucas Oliveira' },
]

export default function FitnessApp() {
  const [maxLoads, setMaxLoads] = useState<MaxLoad[]>([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('Todos')
  const [isAddLoadOpen, setIsAddLoadOpen] = useState(false)
  const [newLoad, setNewLoad] = useState({ exerciseId: '', weight: '' })
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizData, setQuizData] = useState<QuizData>({
    name: '',
    age: '',
    weight: '',
    height: '',
    hasPracticed: '',
    experienceLevel: '',
    weeklyFrequency: '',
    mainGoals: '',
    otherGoal: '',
    followsDiet: '',
    dietType: '',
    otherDiet: '',
    hasLimitation: '',
    limitation: '',
    additionalGoals: ''
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fitness-max-loads')
    if (saved) {
      setMaxLoads(JSON.parse(saved))
    }
    const savedName = localStorage.getItem('fitness-user-name')
    if (savedName) {
      setCurrentUserName(savedName)
    } else {
      setCurrentUserName('Você')
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    if (maxLoads.length > 0) {
      localStorage.setItem('fitness-max-loads', JSON.stringify(maxLoads))
    }
  }, [maxLoads])

  useEffect(() => {
    if (currentUserName && currentUserName !== 'Você') {
      localStorage.setItem('fitness-user-name', currentUserName)
    }
  }, [currentUserName])

  const muscleGroups = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps']

  const filteredExercises = selectedMuscleGroup === 'Todos' 
    ? exercisesDatabase 
    : exercisesDatabase.filter(ex => ex.muscleGroup === selectedMuscleGroup)

  const addMaxLoad = () => {
    if (!newLoad.exerciseId || !newLoad.weight) return
    
    const exercise = exercisesDatabase.find(ex => ex.id === newLoad.exerciseId)
    if (!exercise) return

    const load: MaxLoad = {
      exerciseId: newLoad.exerciseId,
      exerciseName: exercise.name,
      weight: parseFloat(newLoad.weight),
      date: new Date().toISOString(),
      userId: 'current-user',
      userName: currentUserName
    }

    setMaxLoads([...maxLoads, load])
    setNewLoad({ exerciseId: '', weight: '' })
    setIsAddLoadOpen(false)
  }

  const deleteMaxLoad = (index: number) => {
    setMaxLoads(maxLoads.filter((_, i) => i !== index))
  }

  // Preparar dados para o gráfico
  const getChartData = (exerciseId: string) => {
    return maxLoads
      .filter(load => load.exerciseId === exerciseId)
      .map(load => ({
        date: new Date(load.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        weight: load.weight
      }))
      .slice(-10) // Últimos 10 registros
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-500'
      case 'Intermediário': return 'bg-orange-500'
      case 'Avançado': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Obter ranking por exercício
  const getRankingByExercise = (exerciseId: string) => {
    const allLoads = [...mockUserLoads, ...maxLoads.filter(l => l.userId === 'current-user')]
    const exerciseLoads = allLoads.filter(l => l.exerciseId === exerciseId)
    
    // Agrupar por usuário e pegar a carga máxima de cada um
    const userMaxLoads = exerciseLoads.reduce((acc, load) => {
      if (!acc[load.userId] || acc[load.userId].weight < load.weight) {
        acc[load.userId] = load
      }
      return acc
    }, {} as Record<string, MaxLoad>)

    // Ordenar por peso decrescente
    return Object.values(userMaxLoads).sort((a, b) => b.weight - a.weight)
  }

  // Quiz handlers
  const handleQuizNext = () => {
    if (quizStep < 12) {
      setQuizStep(quizStep + 1)
    } else {
      // Finalizar quiz
      if (quizData.name) {
        setCurrentUserName(quizData.name)
      }
      setIsQuizOpen(false)
      setQuizStep(0)
      alert('Quiz concluído! Suas informações foram salvas. 💪✨')
    }
  }

  const handleQuizPrev = () => {
    if (quizStep > 0) {
      setQuizStep(quizStep - 1)
    }
  }

  const updateQuizData = (field: keyof QuizData, value: string) => {
    setQuizData({ ...quizData, [field]: value })
  }

  const canProceedQuiz = () => {
    switch (quizStep) {
      case 0: return quizData.name.trim() !== ''
      case 1: return quizData.age !== ''
      case 2: return quizData.weight.trim() !== ''
      case 3: return quizData.height.trim() !== ''
      case 4: return quizData.hasPracticed !== ''
      case 5: return quizData.experienceLevel !== ''
      case 6: return quizData.weeklyFrequency !== ''
      case 7: return quizData.mainGoals !== ''
      case 8: return quizData.followsDiet !== ''
      case 9: return quizData.followsDiet === 'Não' || quizData.dietType !== ''
      case 10: return quizData.hasLimitation !== ''
      case 11: return quizData.hasLimitation === 'Não' || quizData.limitation.trim() !== ''
      case 12: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">MuscleConnect</h1>
                <p className="text-orange-100 text-sm">Conecte-se e eleve seu treino! 🚀</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsQuizOpen(true)}
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Fazer Quiz
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="exercises" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto">
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Exercícios</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="loads" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Cargas</span>
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Ranking</span>
            </TabsTrigger>
          </TabsList>

          {/* ABA EXERCÍCIOS */}
          <TabsContent value="exercises" className="space-y-6">
            {/* Filtros */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-600">Grupos Musculares</CardTitle>
                <CardDescription>Selecione o grupo muscular para ver os exercícios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {muscleGroups.map(group => (
                    <Button
                      key={group}
                      variant={selectedMuscleGroup === group ? 'default' : 'outline'}
                      onClick={() => setSelectedMuscleGroup(group)}
                      className={selectedMuscleGroup === group ? 'bg-gradient-to-r from-orange-600 to-blue-600' : ''}
                    >
                      {group}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lista de Exercícios */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredExercises.map(exercise => (
                <Card key={exercise.id} className="hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{exercise.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {exercise.muscleGroup}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Badge className={`${getDifficultyColor(exercise.difficulty)} text-white text-xs`}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">📝 Descrição</h4>
                      <p className="text-sm text-gray-600">{exercise.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">🏋️ Aparelhos</h4>
                      <div className="flex flex-wrap gap-1">
                        {exercise.equipment.map((eq, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-blue-50 border-blue-200">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">💡 Dicas</h4>
                      <ul className="space-y-1">
                        {exercise.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ABA PROGRESSO */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Evolução das Cargas
                </CardTitle>
                <CardDescription>Visualize seu progresso ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                {maxLoads.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Nenhum registro ainda. Comece adicionando suas cargas máximas!</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Array.from(new Set(maxLoads.map(l => l.exerciseId))).map(exerciseId => {
                      const chartData = getChartData(exerciseId)
                      const exercise = exercisesDatabase.find(ex => ex.id === exerciseId)
                      
                      if (chartData.length === 0) return null

                      return (
                        <div key={exerciseId} className="space-y-3">
                          <h3 className="font-semibold text-lg">{exercise?.name}</h3>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip 
                                  formatter={(value) => [`${value} kg`, 'Carga']}
                                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="weight" 
                                  stroke="#ea580c" 
                                  strokeWidth={3}
                                  dot={{ fill: '#ea580c', r: 5 }}
                                  activeDot={{ r: 7 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA CARGAS */}
          <TabsContent value="loads" className="space-y-6">
            <Card className="border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-orange-600">Registro de Cargas Máximas</CardTitle>
                    <CardDescription>Acompanhe suas cargas máximas por exercício</CardDescription>
                  </div>
                  <Dialog open={isAddLoadOpen} onOpenChange={setIsAddLoadOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-600 to-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registrar Carga Máxima</DialogTitle>
                        <DialogDescription>
                          Adicione um novo registro de carga máxima para acompanhar seu progresso
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="exercise">Exercício</Label>
                          <select
                            id="exercise"
                            className="w-full px-3 py-2 border rounded-md"
                            value={newLoad.exerciseId}
                            onChange={(e) => setNewLoad({ ...newLoad, exerciseId: e.target.value })}
                          >
                            <option value="">Selecione um exercício</option>
                            {exercisesDatabase.map(ex => (
                              <option key={ex.id} value={ex.id}>
                                {ex.name} ({ex.muscleGroup})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Carga (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            placeholder="Ex: 80"
                            value={newLoad.weight}
                            onChange={(e) => setNewLoad({ ...newLoad, weight: e.target.value })}
                          />
                        </div>
                        <Button 
                          onClick={addMaxLoad} 
                          className="w-full bg-gradient-to-r from-orange-600 to-blue-600"
                        >
                          Salvar Registro
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {maxLoads.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Nenhuma carga registrada ainda.</p>
                    <p className="text-sm mt-2">Clique em "Adicionar" para começar!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {maxLoads.slice().reverse().map((load, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{load.exerciseName}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-2xl font-bold text-orange-600">{load.weight} kg</span>
                              <span className="text-sm text-gray-500">
                                {new Date(load.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMaxLoad(maxLoads.length - 1 - idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA RANKING */}
          <TabsContent value="ranking" className="space-y-6">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-600 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Ranking de Cargas Máximas
                </CardTitle>
                <CardDescription>Veja as cargas máximas de outros usuários e compare seu desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {exercisesDatabase.map(exercise => {
                    const ranking = getRankingByExercise(exercise.id)
                    if (ranking.length === 0) return null

                    return (
                      <div key={exercise.id} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{exercise.name}</h3>
                          <Badge variant="secondary">{exercise.muscleGroup}</Badge>
                        </div>
                        <div className="space-y-2">
                          {ranking.map((load, index) => {
                            const isCurrentUser = load.userId === 'current-user'
                            const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''
                            
                            return (
                              <div 
                                key={`${load.userId}-${load.exerciseId}`}
                                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                                  isCurrentUser 
                                    ? 'bg-gradient-to-r from-orange-100 to-blue-100 border-orange-300 shadow-md' 
                                    : 'bg-white border-gray-200 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <span className="text-2xl font-bold text-gray-400 w-8">
                                    {medalEmoji || `#${index + 1}`}
                                  </span>
                                  <div>
                                    <p className={`font-semibold ${isCurrentUser ? 'text-orange-700' : 'text-gray-800'}`}>
                                      {load.userName}
                                      {isCurrentUser && <span className="ml-2 text-xs">(Você)</span>}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(load.date).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-orange-600">{load.weight} kg</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Quiz Dialog */}
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              🏋️‍♂️ Quiz de Avaliação para Musculação: Descubra Seu Potencial! 🏋️‍♀️
            </DialogTitle>
            <DialogDescription className="text-base">
              Está pronto para levar seu treino ao próximo nível? Responda ao nosso quiz e descubra tudo sobre seu perfil muscular! Com informações como peso, altura e objetivos, podemos personalizar dicas e treinos que se adequam ao seu estilo de vida.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-6">
            {/* Indicador de progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pergunta {quizStep + 1} de 13</span>
                <span>{Math.round(((quizStep + 1) / 13) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((quizStep + 1) / 13) * 100}%` }}
                />
              </div>
            </div>

            {/* Perguntas */}
            {quizStep === 0 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">1. Qual é o seu nome?</Label>
                <Input
                  placeholder="Digite seu nome"
                  value={quizData.name}
                  onChange={(e) => updateQuizData('name', e.target.value)}
                />
              </div>
            )}

            {quizStep === 1 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">2. Quantos anos você tem?</Label>
                <RadioGroup value={quizData.age} onValueChange={(value) => updateQuizData('age', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="18-25" id="age1" />
                    <Label htmlFor="age1">18 a 25 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="26-35" id="age2" />
                    <Label htmlFor="age2">26 a 35 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="36-45" id="age3" />
                    <Label htmlFor="age3">36 a 45 anos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="46+" id="age4" />
                    <Label htmlFor="age4">46 anos ou mais</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {quizStep === 2 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">3. Qual é o seu peso?</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Ex: 75"
                    value={quizData.weight}
                    onChange={(e) => updateQuizData('weight', e.target.value)}
                  />
                  <span className="text-gray-600">kg</span>
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">4. Qual é a sua altura?</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Ex: 175"
                    value={quizData.height}
                    onChange={(e) => updateQuizData('height', e.target.value)}
                  />
                  <span className="text-gray-600">cm</span>
                </div>
              </div>
            )}

            {quizStep === 4 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">5. Você já praticou musculação?</Label>
                <RadioGroup value={quizData.hasPracticed} onValueChange={(value) => updateQuizData('hasPracticed', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="practiced1" />
                    <Label htmlFor="practiced1">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="practiced2" />
                    <Label htmlFor="practiced2">Não</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {quizStep === 5 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">6. Qual é o seu nível de experiência?</Label>
                <RadioGroup value={quizData.experienceLevel} onValueChange={(value) => updateQuizData('experienceLevel', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Iniciante" id="exp1" />
                    <Label htmlFor="exp1">Iniciante (menos de 6 meses)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediário" id="exp2" />
                    <Label htmlFor="exp2">Intermediário (6 meses a 2 anos)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Avançado" id="exp3" />
                    <Label htmlFor="exp3">Avançado (mais de 2 anos)</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {quizStep === 6 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">7. Com que frequência você se exercita por semana?</Label>
                <RadioGroup value={quizData.weeklyFrequency} onValueChange={(value) => updateQuizData('weeklyFrequency', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="<1" id="freq1" />
                    <Label htmlFor="freq1">Menos de 1 vez</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2" id="freq2" />
                    <Label htmlFor="freq2">1 a 2 vezes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-4" id="freq3" />
                    <Label htmlFor="freq3">3 a 4 vezes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5+" id="freq4" />
                    <Label htmlFor="freq4">5 ou mais vezes</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {quizStep === 7 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">8. Quais são os seus principais objetivos?</Label>
                <RadioGroup value={quizData.mainGoals} onValueChange={(value) => updateQuizData('mainGoals', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ganhar massa muscular" id="goal1" />
                    <Label htmlFor="goal1">Ganhar massa muscular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Perder peso" id="goal2" />
                    <Label htmlFor="goal2">Perder peso</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Aumentar a resistência" id="goal3" />
                    <Label htmlFor="goal3">Aumentar a resistência</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Melhorar definição" id="goal4" />
                    <Label htmlFor="goal4">Melhorar definição</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Outros" id="goal5" />
                    <Label htmlFor="goal5">Outros</Label>
                  </div>
                </RadioGroup>
                {quizData.mainGoals === 'Outros' && (
                  <Input
                    placeholder="Especifique seu objetivo"
                    value={quizData.otherGoal}
                    onChange={(e) => updateQuizData('otherGoal', e.target.value)}
                  />
                )}
              </div>
            )}

            {quizStep === 8 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">9. Você segue alguma dieta específica?</Label>
                <RadioGroup value={quizData.followsDiet} onValueChange={(value) => updateQuizData('followsDiet', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="diet1" />
                    <Label htmlFor="diet1">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="diet2" />
                    <Label htmlFor="diet2">Não</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {quizStep === 9 && quizData.followsDiet === 'Sim' && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">10. Se sim, qual?</Label>
                <RadioGroup value={quizData.dietType} onValueChange={(value) => updateQuizData('dietType', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Proteica" id="diettype1" />
                    <Label htmlFor="diettype1">Proteica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Low-carb" id="diettype2" />
                    <Label htmlFor="diettype2">Low-carb</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vegana" id="diettype3" />
                    <Label htmlFor="diettype3">Vegana</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Outros" id="diettype4" />
                    <Label htmlFor="diettype4">Outros</Label>
                  </div>
                </RadioGroup>
                {quizData.dietType === 'Outros' && (
                  <Input
                    placeholder="Especifique sua dieta"
                    value={quizData.otherDiet}
                    onChange={(e) => updateQuizData('otherDiet', e.target.value)}
                  />
                )}
              </div>
            )}

            {quizStep === 9 && quizData.followsDiet === 'Não' && (
              <div className="text-center py-8 text-gray-500">
                <p>Você não segue uma dieta específica no momento.</p>
              </div>
            )}

            {quizStep === 10 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">11. Você tem alguma limitação física?</Label>
                <RadioGroup value={quizData.hasLimitation} onValueChange={(value) => updateQuizData('hasLimitation', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="limit1" />
                    <Label htmlFor="limit1">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="limit2" />
                    <Label htmlFor="limit2">Não</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {quizStep === 11 && quizData.hasLimitation === 'Sim' && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">12. Se sim, qual?</Label>
                <Textarea
                  placeholder="Descreva sua limitação física"
                  value={quizData.limitation}
                  onChange={(e) => updateQuizData('limitation', e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {quizStep === 11 && quizData.hasLimitation === 'Não' && (
              <div className="text-center py-8 text-gray-500">
                <p>Ótimo! Você não possui limitações físicas.</p>
              </div>
            )}

            {quizStep === 12 && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">13. O que mais você gostaria de alcançar com seu treino?</Label>
                <Textarea
                  placeholder="Compartilhe seus objetivos e expectativas..."
                  value={quizData.additionalGoals}
                  onChange={(e) => updateQuizData('additionalGoals', e.target.value)}
                  rows={5}
                />
              </div>
            )}

            {/* Navegação */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleQuizPrev}
                disabled={quizStep === 0}
              >
                Anterior
              </Button>
              <Button
                onClick={handleQuizNext}
                disabled={!canProceedQuiz()}
                className="bg-gradient-to-r from-orange-600 to-blue-600"
              >
                {quizStep === 12 ? 'Finalizar 🚀' : 'Próximo'}
              </Button>
            </div>
          </div>

          {quizStep === 12 && (
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-lg border border-orange-200 mt-4">
              <p className="text-center font-semibold text-gray-800">
                🚀 <em>Obrigado por participar!</em>
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                Ao completar este quiz, você nos ajudará a criar um plano de treino que se encaixa perfeitamente em suas necessidades e objetivos. Prepare-se para transformar seu corpo e sua mente! 💪✨
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dumbbell className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-lg">MuscleConnect</span>
          </div>
          <p className="text-gray-400 text-sm">
            Conecte-se e eleve seu treino a um novo nível! 💪🚀
          </p>
        </div>
      </footer>
    </div>
  )
}
