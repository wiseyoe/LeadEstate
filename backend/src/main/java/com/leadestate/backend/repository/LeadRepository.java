package com.leadestate.backend.repository;

import com.leadestate.backend.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository 
public interface LeadRepository extends JpaRepository<Lead, Integer> {

    // Menghitung total semua lead
    long count();

    // Menghitung lead berdasarkan ID status tertentu
    long countByStatus_Id(int statusId);

    // Query kustom untuk mengambil statistik jumlah lead per status
    @Query("SELECT l.status.id, l.status.statusName, COUNT(l) " +
       "FROM Lead l " +
       "GROUP BY l.status.id, l.status.statusName")
    List<Object[]> countLeadsByStatus();
}