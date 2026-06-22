<?php

namespace App\Models;

use CodeIgniter\Model;

class LoanModel extends Model
{
    protected $table = 'loans';
    protected $primaryKey = 'id';
    protected $allowedFields = ['book_id', 'member_id', 'loan_date', 'due_date', 'return_date', 'status'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = false;

    public function getLoansWithDetails()
    {
        return $this->select('loans.*, books.title as book_title, books.isbn, members.full_name as member_name, members.member_code')
                    ->join('books', 'books.id = loans.book_id')
                    ->join('members', 'members.id = loans.member_id')
                    ->orderBy('loans.loan_date', 'DESC')
                    ->findAll();
    }

    public function getActiveLoans()
    {
        return $this->where('status', 'borrowed')
                    ->orWhere('status', 'overdue')
                    ->countAllResults();
    }
}