package com.leadestate.backend.repository;

import com.leadestate.backend.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository 
public interface LeadRepository extends JpaRepository<Lead, Integer> {

    // Filter lead berdasarkan ID sales
    List<Lead> findBySalesId(int salesId);

    // Menghitung total semua lead
    long count();

    // Menghitung lead berdasarkan ID status tertentu
    long countByStatus_Id(int statusId);

    // Query kustom untuk mengambil statistik jumlah lead per status
    @Query("SELECT l.status.id, l.status.statusName, COUNT(l) " +
       "FROM Lead l " +
       "GROUP BY l.status.id, l.status.statusName")
    List<Object[]> countLeadsByStatus();

    // Lead per Month
    @Query("SELECT FUNCTION('MONTH', l.createdAt), COUNT(l) " +
        "FROM Lead l " +
        "GROUP BY FUNCTION('MONTH', l.createdAt) " +
        "ORDER BY FUNCTION('MONTH', l.createdAt)")
    List<Object[]> countLeadsPerMonth();

    // Performance per Sales
    @Query("SELECT l.salesId, COUNT(l) " +
        "FROM Lead l " +
        "GROUP BY l.salesId")
    List<Object[]> countLeadsBySales();

    //Filter Leads
    @Query("SELECT l FROM Lead l WHERE " +
        "(:salesId IS NULL OR l.salesId = :salesId) AND " +
        "(:propertyId IS NULL OR l.propertyId = :propertyId) AND " +
        "(:start IS NULL OR l.createdAt >= :start) AND " +
        "(:end IS NULL OR l.createdAt <= :end)")
    List<Lead> filterLeads(
        Integer salesId,
        Integer propertyId,
        java.time.LocalDateTime start,
        java.time.LocalDateTime end
    );
}