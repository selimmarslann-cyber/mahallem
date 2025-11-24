'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  CreditCard,
  TrendingUp,
  History
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'payment' | 'reward'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export default function AccountWalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  
  // Deposit form
  const [depositAmount, setDepositAmount] = useState('')
  const [depositing, setDepositing] = useState(false)
  
  // Withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [iban, setIban] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      // Referral balance'ı al
      const res = await fetch('/api/referral/overview', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setBalance(parseFloat(data.currentBalance || 0))
      }

      // İşlem geçmişi (mock - gerçek endpoint eklenebilir)
      // const transactionsRes = await fetch('/api/wallet/transactions', { credentials: 'include' })
      // if (transactionsRes.ok) {
      //   const transactionsData = await transactionsRes.json()
      //   setTransactions(transactionsData)
      // }
      
      // Mock transactions
      setTransactions([
        {
          id: '1',
          type: 'deposit',
          amount: 500,
          description: 'Cüzdana yükleme',
          date: new Date().toISOString(),
          status: 'completed',
        },
        {
          id: '2',
          type: 'payment',
          amount: -150,
          description: 'Hizmet ödemesi',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
        },
        {
          id: '3',
          type: 'reward',
          amount: 25.50,
          description: 'Referral kazancı',
          date: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed',
        },
      ])
    } catch (err) {
      console.error('Cüzdan verisi yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(depositAmount)
    
    if (amount <= 0) {
      alert('Lütfen geçerli bir tutar girin')
      return
    }

    setDepositing(true)
    try {
      // TODO: Gerçek ödeme entegrasyonu (iyzico, PayTR, vb.)
      // Şimdilik mock
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Bakiye güncelle
      setBalance(prev => prev + amount)
      
      // İşlem ekle
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount,
        description: 'Cüzdana yükleme',
        date: new Date().toISOString(),
        status: 'completed',
      }
      setTransactions(prev => [newTransaction, ...prev])
      
      setDepositAmount('')
      alert('Para yükleme başarılı! (Mock - gerçek ödeme entegrasyonu eklenecek)')
    } catch (err) {
      console.error('Yükleme hatası:', err)
      alert('Bir hata oluştu')
    } finally {
      setDepositing(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(withdrawAmount)
    
    if (amount <= 0) {
      alert('Lütfen geçerli bir tutar girin')
      return
    }

    if (amount > balance) {
      alert('Yetersiz bakiye')
      return
    }

    if (!iban || iban.length < 15) {
      alert('Lütfen geçerli bir IBAN girin')
      return
    }

    setWithdrawing(true)
    try {
      // TODO: Gerçek para çekme API'si
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Bakiye güncelle
      setBalance(prev => prev - amount)
      
      // İşlem ekle
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        amount: -amount,
        description: `Para çekme - IBAN: ${iban.slice(0, 4)}****${iban.slice(-4)}`,
        date: new Date().toISOString(),
        status: 'pending',
      }
      setTransactions(prev => [newTransaction, ...prev])
      
      setWithdrawAmount('')
      setIban('')
      alert('Para çekme talebi oluşturuldu! (Mock - gerçek entegrasyon eklenecek)')
    } catch (err) {
      console.error('Çekme hatası:', err)
      alert('Bir hata oluştu')
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cüzdanım</h1>
        <p className="text-gray-600 mt-2">Bakiyenizi yönetin ve işlemlerinizi görüntüleyin</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Cüzdan Bakiyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{balance.toFixed(2)} ₺</div>
            <p className="text-sm text-gray-600">
              Mahallem üzerindeki harcamaların buradan düşer.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Deposit & Withdraw Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-green-600" />
                Para Yükle
              </CardTitle>
              <CardDescription>Cüzdanınıza para yükleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">Yükleme Tutarı (₺)</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    step="0.01"
                    min="1"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Kart Bilgileri</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Kart üzerindeki isim"
                      className="text-sm"
                    />
                    <Input
                      placeholder="Kart numarası"
                      className="text-sm"
                      maxLength={19}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="AA/YY"
                        className="text-sm"
                        maxLength={5}
                      />
                      <Input
                        placeholder="CVV"
                        className="text-sm"
                        type="password"
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Gerçek ödeme entegrasyonu eklenecek (iyzico/PayTR)
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={depositing}>
                  {depositing ? 'Yükleniyor...' : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Cüzdana Yükle
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Withdraw Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-blue-600" />
                Para Çek
              </CardTitle>
              <CardDescription>Bakiyenizi banka hesabınıza aktarın</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount">Çekilecek Tutar (₺)</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    step="0.01"
                    min="1"
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Maksimum: {balance.toFixed(2)} ₺
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={iban}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '').toUpperCase()
                      setIban(value)
                    }}
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    maxLength={34}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Para çekme talebi oluşturulacak
                  </p>
                </div>

                <Button 
                  type="submit" 
                  variant="outline" 
                  className="w-full" 
                  disabled={withdrawing || balance <= 0}
                >
                  {withdrawing ? 'İşleniyor...' : 'Para Çekme Talebi Oluştur'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              İşlem Geçmişi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Henüz işlem geçmişi yok
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' || transaction.type === 'reward'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <ArrowDownCircle className="w-5 h-5" />
                        ) : transaction.type === 'withdraw' ? (
                          <ArrowUpCircle className="w-5 h-5" />
                        ) : transaction.type === 'reward' ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <CreditCard className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} ₺
                      </p>
                      <p className={`text-xs ${
                        transaction.status === 'completed' 
                          ? 'text-green-600' 
                          : transaction.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.status === 'completed' 
                          ? 'Tamamlandı' 
                          : transaction.status === 'pending'
                          ? 'Beklemede'
                          : 'Başarısız'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

